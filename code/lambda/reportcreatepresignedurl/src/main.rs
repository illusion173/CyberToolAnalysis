use aws_sdk_dynamodb::types::AttributeValue;
use aws_sdk_dynamodb::Client as DynamoDBClient;
use aws_sdk_s3::presigning::PresigningConfig;
use aws_sdk_s3::Client as S3Client;
use lambda_runtime::{run, service_fn, Error, LambdaEvent};
use serde::{Deserialize, Serialize};
use std::time::Duration;
#[derive(Deserialize)]
struct Request {
    user_identifier: String,
    file_name: String,
}

#[derive(Deserialize, Serialize)]
struct Response {
    status_code: u32,
    url: String,
}

const REPORTBUCKET: &str = "reportcybertool-cs490";
const REPORTTABLENAME: &str = "ReportLocationTable";
async fn get_file_object_key(file_name: String, user_identifier: String) -> Result<String, Error> {
    let file_uuid = "TEST".to_string();
    let config = aws_config::load_from_env().await;
    // Create a new s3 client
    let client = DynamoDBClient::new(&config);

    Ok(file_uuid)
}
async fn get_presigned_request(client_opts: &Request) -> Result<String, Error> {
    let file_key = get_file_object_key(
        client_opts.file_name.clone(),
        client_opts.user_identifier.clone(),
    )
    .await?;
    // Get config from env
    let config = aws_config::load_from_env().await;
    // Create a new s3 client
    let client = S3Client::new(&config);
    let expires_in = Duration::from_secs(604800);
    // Generate request & send, await feedback
    let presigned_request = client
        .get_object()
        .bucket(REPORTBUCKET)
        .key(file_key)
        .presigned(PresigningConfig::expires_in(expires_in)?)
        .await?;
    // When presigned_url dont, get url convert to string.
    let url = presigned_request.uri().to_string();
    Ok(url)
}

async fn function_handler(event: LambdaEvent<Request>) -> Result<Response, Error> {
    // Derive the options, bucket, object, time?
    let client_opts = &event.payload;
    let presigned_url = get_presigned_request(client_opts).await?;

    // Return Response, contains url for physical object in s3
    let resp = Response {
        status_code: 200,
        url: presigned_url,
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
