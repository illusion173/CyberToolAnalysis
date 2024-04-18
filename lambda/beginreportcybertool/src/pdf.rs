use anyhow::Result;
use aws_sdk_s3::operation::{get_object::GetObjectError, put_object::PutObjectError};
use aws_sdk_s3::{error::SdkError, primitives::ByteStream, Client};
use chrono::*;
use flate2::read::GzDecoder;
use genpdf::{elements, style, Element};
use lambda_runtime::{run, service_fn, Error, LambdaEvent};
use serde::{Deserialize, Serialize};
use std::{fs, fs::File, io::Write, path::Path};
use tar::Archive;
use uuid::Uuid;

use crate::types::ToolRow;

const TEMPDIR: &str = "/tmp";
const FONTSDIR: &str = "/tmp/fonts";
const DEFAULT_FONT_NAME: &str = "LiberationSans";
const FONTBUCKET: &str = "reportcybertool-cs490";
const FONTZIPNAME: &str = "fonts.tar.gz";
const FONTZIPKEY: &str = "fonts/fonts.tar.gz";
const REPORTBUCKET: &str = "reportcybertool-cs490";
const FILETABLENAME: &str = "ReportLocationTable";

#[derive(Deserialize, Debug)]
struct Request {
    user_identifier: String,
    file_name: String,
}

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

/// Uploads pdf bytes to `reports/file_name` and returns the s3 key
async fn put_file_s3(pdf: Vec<u8>, file_name: &str, s3client: &Client) -> Result<String> {
    let key = format!("reports/{file_name}");
    s3client
        .put_object()
        .body(ByteStream::from(pdf))
        .bucket(REPORTBUCKET)
        .key(&key)
        .send()
        .await?;

    Ok(key)
}

fn iso8601_date_string() -> String {
    NaiveDateTime::new(
        Local::now().naive_local().date(),
        NaiveTime::from_hms_milli_opt(0, 0, 0, 000).expect("Failed to create a NaiveTime!"),
    )
    .format("%Y-%m-%dT%H:%M:%S%.3fZ")
    .to_string()
}

async fn load_fonts(s3client: &Client) -> Result<()> {
    // Create the /tmp/fonts directory
    fs::create_dir_all(FONTSDIR)?;

    let joined_string = format!("{}{}{}", TEMPDIR, "/", FONTZIPNAME);
    // Create a local dummy file
    let mut file = File::create(&joined_string).unwrap();

    // Retrieve file
    let mut s3_file_object = s3client
        .get_object()
        .bucket(FONTBUCKET)
        .key(FONTZIPKEY)
        .send()
        .await?;
    println!("FINISHED DOWNLOADING FONT FROM S3");

    // Write to /tmp/fonts
    while let Some(bytes) = s3_file_object.body.try_next().await.unwrap() {
        file.write(&bytes).unwrap();
    }

    println!("FINISHED WRITING TO /tmp/fonts");

    let tar_gz = File::open(joined_string).unwrap();

    let tar = GzDecoder::new(tar_gz);
    let mut archive = Archive::new(tar);
    archive.unpack(".").unwrap();

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

    tool_table
        .row()
        .element(
            elements::Paragraph::new("Tool")
                .styled(style::Effect::Bold)
                .padded(1),
        )
        .element(
            elements::Paragraph::new("Recommendation")
                .styled(style::Effect::Bold)
                .padded(1),
        )
        .push()
        .expect("Invalid table row");

    doc.push(tool_table);

    let mut pdf = vec![];
    doc.render(&mut pdf)?;

    Ok(pdf)
}

pub async fn upload_report(
    ranked_tools: &[(ToolRow, f32)],
    file_name: &str,
    client: &aws_sdk_s3::Client,
) -> Result<String> {
    // Load fonts
    load_fonts(client).await?;
    // Create report
    let pdf_bytes = gen_pdf(ranked_tools).await?;
    // Send report to s3
    let key = put_file_s3(pdf_bytes, file_name, client).await?;

    Ok(key)
}
