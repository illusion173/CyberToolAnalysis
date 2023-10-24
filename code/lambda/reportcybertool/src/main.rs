use aws_config;
use aws_sdk_dynamodb::types::AttributeValue;
use aws_sdk_dynamodb::Client as dynamoClient;
use aws_sdk_dynamodb::Error as DynamoError;
use aws_sdk_s3::operation::{get_object::GetObjectError, put_object::PutObjectError};
use aws_sdk_s3::{error::SdkError, primitives::ByteStream, Client};
use flate2::read::GzDecoder;
use genpdf::{elements, style, Element};
use lambda_runtime::{run, service_fn, Error, LambdaEvent};
use serde::{Deserialize, Serialize};
use std::{fs, fs::File, io::Write, path::Path};
use tar::Archive;
use tokio_stream::StreamExt;
use uuid::Uuid;

const TEMPDIR: &'static str = "/tmp";
const FONTSDIR: &'static str = "/tmp/fonts";
const DEFAULT_FONT_NAME: &'static str = "LiberationSans";
const FONTBUCKET: &'static str = "reportcybertool-cs490";
const FONTZIPNAME: &'static str = "fonts.tar.gz";
const FONTZIPKEY: &'static str = "fonts/fonts.tar.gz";
const REPORTBUCKET: &'static str = "reportcybertool-cs490";
const FILETABLENAME: &'static str = "TEST";

#[derive(Deserialize)]
struct Request {
    user_identifier: String,
    file_name: String,
}

#[derive(Serialize)]
struct Response {
    status_code: u64,
    file_name: String,
    bucket: String,
    object_key: String,
}

#[derive(Serialize)]
pub struct FileItem {
    pub cognito_user_data: String,
    pub file_name: String,
    pub bucket: String,
    pub object_key: String,
}

// This function loads an entry for the report for later lookup
async fn put_file_dynamo(
    file_item: &FileItem,
    dynamo_client: &dynamoClient,
) -> Result<(), DynamoError> {
    let file_uuid_object_key =
        AttributeValue::S(format!("{}{}", "reports/", file_item.object_key.clone()));
    let file_name = AttributeValue::S(file_item.file_name.clone());
    let user_identifer = AttributeValue::S(file_item.cognito_user_data.clone());
    let date_made = AttributeValue::S(chrono::offset::Utc::now().to_string());
    dynamo_client
        .put_item()
        .table_name(FILETABLENAME)
        .item("file_uuid_object_key", file_uuid_object_key)
        .item("file_name", file_name)
        .item("user_identifier", user_identifer)
        .item("date_made", date_made)
        .send()
        .await?;

    Ok(())
}
async fn put_file_s3(
    file_item: &FileItem,
    s3client: &Client,
) -> Result<(), SdkError<PutObjectError>> {
    let report_local_location = format!("{}{}{}{}", TEMPDIR, "/", file_item.file_name, ".pdf");

    let body = ByteStream::from_path(Path::new(report_local_location.as_str()))
        .await
        .unwrap();

    let report_s3_key = format!("{}{}", "reports/", file_item.object_key.clone());

    // Put the Item in the bucket
    s3client
        .put_object()
        .body(body)
        .bucket(REPORTBUCKET)
        .key(report_s3_key)
        .send()
        .await?;

    Ok(())
}

async fn create_directories() -> Result<(), Error> {
    // Change the current working directory to /tmp
    std::env::set_current_dir(TEMPDIR.to_owned())?;
    // Create the /tmp/fonts directory
    fs::create_dir_all(FONTSDIR.to_owned())?;

    Ok(())
}

async fn load_fonts(s3client: &Client) -> Result<(), SdkError<GetObjectError>> {
    create_directories().await.unwrap();

    let joined_string = format!("{}{}{}", FONTSDIR, "/", FONTZIPNAME);
    // Create a local dummy file
    let mut file = File::create(&joined_string).unwrap();

    // Retrieve file
    let mut s3_file_object = s3client
        .get_object()
        .bucket(FONTBUCKET)
        .key(FONTZIPKEY)
        .send()
        .await?;

    // Write to /tmp/fonts
    while let Some(bytes) = s3_file_object.body.try_next().await.unwrap() {
        file.write(&bytes).unwrap();
    }

    let tar_gz = File::open(joined_string).unwrap();

    let tar = GzDecoder::new(tar_gz);
    let mut archive = Archive::new(tar);
    archive.unpack(FONTSDIR).unwrap();

    Ok(())
}

async fn make_file(file_item: &FileItem) -> Result<(), Error> {
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

    for i in 0..10 {
        tool_table
            .row()
            // Insert into Tool column
            .element(elements::Paragraph::new(format!("#{}", i)).padded(1))
            // Insert into Recommendation column
            .element(elements::Paragraph::new(format!("HELLO!")).padded(1))
            .element(elements::Paragraph::new(format!("HELLO!")).padded(1))
            .push()
            .expect("Invalid table row");
    }

    doc.push(tool_table);

    // Render the document and write it to a file
    let joined_report_doc_file_location =
        format!("{}{}{}{}", TEMPDIR, "/", file_item.file_name, ".pdf");

    // Save file locally to /tmp
    doc.render_to_file(joined_report_doc_file_location)?;

    Ok(())
}

async fn function_handler(event: LambdaEvent<Request>) -> Result<Response, Error> {
    // Create client
    let config = aws_config::load_from_env().await;
    let s3_client = Client::new(&config);

    // Create UUID for file object in bucket
    let file_object_key = Uuid::new_v4();

    // Convert to String
    let file_object_key_string = Uuid::to_string(&file_object_key);
    // Create a file_item to handle opts
    let file_item = FileItem {
        cognito_user_data: event.payload.user_identifier.to_owned(),
        file_name: event.payload.file_name.to_owned(),
        bucket: REPORTBUCKET.to_owned(),
        object_key: file_object_key_string.to_owned(),
    };

    // Load fonts
    load_fonts(&s3_client).await?;
    // Create report
    make_file(&file_item).await?;
    // Send report to s3
    put_file_s3(&file_item, &s3_client).await?;
    // Create dynamo client
    let dynamo_client = dynamoClient::new(&config);
    // Write to dynamodb file entry
    put_file_dynamo(&file_item, &dynamo_client).await?;

    let resp = Response {
        status_code: 200,
        file_name: event.payload.file_name.clone(),
        bucket: REPORTBUCKET.to_owned(),
        object_key: file_object_key_string,
    };

    Ok(resp)
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        // disable printing the name of the module in every log line.
        .with_target(false)
        // disabling time is handy because CloudWatch will add the ingestion time.
        .without_time()
        .init();

    run(service_fn(function_handler)).await
}
