use aws_config;
use aws_sdk_s3 as S3;
use genpdf;
use lambda_runtime::{run, service_fn, Error, LambdaEvent};
use serde::{Deserialize, Serialize};
use std::fs;

const TEMPDIR: &str = "/tmp";
const FONTSDIR: &str = "/tmp/fonts";
#[derive(Deserialize)]
struct Request {
    status_code: u64,
}

#[derive(Serialize)]
struct Response {
    status_code: u64,
    bucket: String,
    object: String,
}

async fn save_file() -> Result<(), Error> {
    Ok(())
}

async fn create_directories() -> Result<(), Error> {
    // Change the current working directory to /tmp
    std::env::set_current_dir(TEMPDIR.to_owned())?;
    // Create the /tmp/fonts directory
    fs::create_dir_all(FONTSDIR.to_owned())?;
    Ok(())
}

async fn load_fonts() -> Result<(), Error> {
    create_directories().await?;
    // Create client
    let config = aws_config::load_from_env().await;
    let s3client = aws_sdk_s3::Client::new(&config);

    // Set S3 bucket of location of font file
    // Set object key
    //

    Ok(())
}

async fn make_file() -> Result<(), Error> {
    // Load a font from the file system
    load_fonts().await?;
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
    doc.render_to_file("output.pdf")?;
    save_file().await?;

    Ok(())
}

async fn function_handler(event: LambdaEvent<Request>) -> Result<Response, Error> {
    // Prepare the response
    let resp = Response {
        status_code: 200,
        bucket: "TEST".to_owned(),
        object: "TESTOBJECT".to_owned(),
    };

    make_file().await?;

    save_file().await?;

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
