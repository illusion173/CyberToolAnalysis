use aws_config;
use aws_sdk_s3::{error::SdkError, primitives::ByteStream, Client};

use aws_sdk_s3::operation::{
    copy_object::{CopyObjectError, CopyObjectOutput},
    create_bucket::{CreateBucketError, CreateBucketOutput},
    get_object::{GetObjectError, GetObjectOutput},
    list_objects_v2::ListObjectsV2Output,
    put_object::{PutObjectError, PutObjectOutput},
};
use genpdf;
use lambda_runtime::{run, service_fn, Error, LambdaEvent};
use serde::{Deserialize, Serialize};
use std::{fs, fs::File, io::Write, path::Path};
use tokio_stream::StreamExt;

const TEMPDIR: &str = "/tmp";
const FONTSDIR: &str = "/tmp/fonts";
const FONTBUCKET: &str = "BUCKETNAME";
const FONTKEY: &str = "FONTKEY";
const REPORTBUCKET: &str = "REPORTBUCKETNAME";
#[derive(Deserialize)]
struct Request {
    status_code: u64,
    file_name: String,
}

#[derive(Serialize)]
struct Response {
    status_code: u64,
    bucket: String,
    object: String,
}

async fn put_file(
    report_file_name: &String,
    s3client: &Client,
) -> Result<(), SdkError<PutObjectError>> {
    let report_local_location = format!("{}{}{}", TEMPDIR, "/", report_file_name);
    let body = ByteStream::from_path(Path::new(report_local_location.as_str()))
        .await
        .unwrap();
    s3client
        .put_object()
        .body(body)
        .bucket(REPORTBUCKET)
        .key(report_file_name)
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

    let joined_string = format!("{}{}{}", FONTSDIR, "/", FONTKEY);
    // Create a local dummy file
    let mut file = File::create(&joined_string).unwrap();

    // Retrieve file
    let mut s3_file_object = s3client
        .get_object()
        .bucket(FONTBUCKET)
        .key(FONTKEY)
        .send()
        .await?;

    // Write to /tmp/fonts
    while let Some(bytes) = s3_file_object.body.try_next().await.unwrap() {
        file.write(&bytes).unwrap();
    }
    Ok(())
}

async fn make_file(report_file_name: &String, s3client: &Client) -> Result<(), Error> {
    // Load a font from the file system
    load_fonts(&s3client).await?;
    let font_family = genpdf::fonts::from_files(FONTSDIR, "LiberationSans", None)?;
    // Create a document and set the default font family
    let mut doc = genpdf::Document::new(font_family);
    doc.set_title("Demo document");
    // Customize the pages
    let mut decorator = genpdf::SimplePageDecorator::new();

    decorator.set_margins(10);

    doc.set_page_decorator(decorator);
    // Add one or more elements
    doc.push(genpdf::elements::Paragraph::new("This is a demo document."));
    // Render the document and write it to a file
    let joined_report_doc_file_location = format!("{}{}{}", TEMPDIR, "/", report_file_name);
    // Save file locally to /tmp
    doc.render_to_file(joined_report_doc_file_location)?;
    Ok(())
}

async fn function_handler(event: LambdaEvent<Request>) -> Result<Response, Error> {
    // Prepare the response
    let report_file_name = event.payload.file_name;
    // Create client
    let config = aws_config::load_from_env().await;
    let s3_client = Client::new(&config);
    make_file(&report_file_name, &s3_client).await?;
    put_file(&report_file_name, &s3_client).await?;

    let resp = Response {
        status_code: 200,
        bucket: "TEST".to_owned(),
        object: "TESTOBJECT".to_owned(),
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
