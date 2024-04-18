use crate::types::ToolRow;
use anyhow::{Context, Result};
use aws_sdk_dynamodb::Client as DynamoClient;
use aws_sdk_s3::{primitives::ByteStream, Client};
use flate2::read::GzDecoder;
use genpdf::{elements, style, Element};
use serde::Serialize;
use std::{fs, fs::File, io::Write};
use tar::Archive;
use uuid::Uuid;

const TEMPDIR: &str = "/tmp";
const FONTSDIR: &str = "/tmp/fonts";
const DEFAULT_FONT_NAME: &str = "LiberationSans";
const FONTBUCKET: &str = "reportcybertool-cs490";
const FONTZIPNAME: &str = "fonts.tar.gz";
const FONTZIPKEY: &str = "fonts/fonts.tar.gz";
const REPORTBUCKET: &str = "reportcybertool-cs490";

#[derive(Serialize)]
struct Response {
    status_code: u64,
    user_identifier: String,
    file_name: String,
    bucket: String,
    object_key: String,
    time_made: String,
}

#[derive(Serialize)]
pub struct FileItem {
    pub user_identifier: String,
    pub file_name: String,
    pub bucket: String,
    pub object_key: String,
}

/// Uploads pdf bytes to `reports/file_name` and returns the unique report id
async fn put_file_s3(pdf: Vec<u8>, s3client: &Client) -> Result<String> {
    let uuid = Uuid::new_v4();
    let uuid = uuid.to_string();
    let key = format!("reports/{uuid}");
    s3client
        .put_object()
        .body(ByteStream::from(pdf))
        .bucket(REPORTBUCKET)
        .key(&key)
        .send()
        .await?;

    Ok(uuid)
}

async fn load_fonts(s3client: &Client) -> Result<()> {
    // Create the /tmp/fonts directory
    fs::create_dir_all(FONTSDIR)?;

    let fonts_tar_path = format!("{TEMPDIR}/{FONTZIPNAME}");
    // Create a local dummy file
    let mut file = File::create(&fonts_tar_path).context("create fonts tar file in /tmp")?;

    // Retrieve file
    let mut s3_file_object = s3client
        .get_object()
        .bucket(FONTBUCKET)
        .key(FONTZIPKEY)
        .send()
        .await?;
    println!("FINISHED DOWNLOADING FONT FROM S3");

    // Write to /tmp/fonts
    while let Some(bytes) = s3_file_object
        .body
        .try_next()
        .await
        .context("read s3 object body")?
    {
        file.write_all(&bytes).context("streaming font to disk")?;
    }

    println!("FINISHED WRITING TO /tmp/fonts");

    let tar_gz = File::open(fonts_tar_path).context("open fonts tar file")?;

    let tar = GzDecoder::new(tar_gz);
    let mut archive = Archive::new(tar);
    archive.unpack(".").context("unpacking fonts tar")?;

    Ok(())
}

async fn gen_pdf(ranked_tools: &[(ToolRow, f32)]) -> Result<Vec<u8>> {
    let font_family = genpdf::fonts::from_files(
        FONTSDIR,
        DEFAULT_FONT_NAME,
        Some(genpdf::fonts::Builtin::Helvetica),
    )?;
    // Create a document and set the default font family
    let mut doc = genpdf::Document::new(font_family);
    doc.set_title("CyberTool Analysis - Report");
    // Customize the pages
    let mut decorator = genpdf::SimplePageDecorator::new();

    decorator.set_margins(10);

    doc.set_page_decorator(decorator);

    // Add one or more elements
    doc.push(elements::Paragraph::new("Below are the recommended tools").padded(1));

    let mut tool_table = elements::TableLayout::new(vec![1, 5]);

    tool_table.set_cell_decorator(elements::FrameCellDecorator::new(true, true, false));

    for (tool, _score) in ranked_tools {
        tool_table
            .row()
            .element(
                elements::Paragraph::new(&tool.name)
                    .styled(style::Effect::Bold)
                    .padded(1),
            )
            .element(
                elements::Paragraph::new(tool.description.as_deref().unwrap_or(""))
                    .styled(style::Effect::Bold)
                    .padded(1),
            )
            .push()
            .expect("Invalid table row");
    }

    doc.push(tool_table);

    let mut pdf = vec![];
    doc.render(&mut pdf)?;

    Ok(pdf)
}

pub async fn upload_report(
    ranked_tools: &[(ToolRow, f32)],
    file_name: &str,
    user_id: &str,
    s3_client: &aws_sdk_s3::Client,
    db_client: &DynamoClient,
) -> Result<String> {
    load_fonts(s3_client).await?;

    let pdf_bytes = gen_pdf(ranked_tools).await.context("generate report pdf")?;

    let report_id = put_file_s3(pdf_bytes, s3_client)
        .await
        .context("upload report to s3")?;

    crate::db_wrapper::add_pdf_for_user(db_client, &report_id, &user_id, file_name)
        .await
        .context("add report link to database")?;

    Ok(report_id)
}
