use aws_sdk_s3::presigning::PresigningConfig;
use aws_sdk_s3::Client as S3Client;
use lambda_runtime::{run, service_fn, Error, LambdaEvent};
use serde::{Deserialize, Serialize};
use std::time::Duration;

#[derive(Deserialize)]
struct Request {
    bucket: String,
    object: String,
    time: u64,
}

#[derive(Serialize, Deserialize)]
pub struct Opts {
    pub bucket: String,
    pub object: String,
    pub expires_in: u64,
}

#[derive(Serialize)]
struct Response {
    status_code: u32,
    url: String,
}

async fn get_presigned_request(client_opts: &Opts) -> Result<String, Error> {
    // Get config from env
    let config = aws_config::load_from_env().await;
    // Create a new s3 client
    let client = S3Client::new(&config);
    let expires_in = Duration::from_secs(client_opts.expires_in);
    // Generate request & send, await feedback
    let presigned_request = client
        .get_object()
        .bucket(&client_opts.bucket)
        .key(&client_opts.object)
        .presigned(PresigningConfig::expires_in(expires_in)?)
        .await?;
    // When presigned_url dont, get url convert to string.
    let url = presigned_request.uri().to_string();
    Ok(url)
}

async fn function_handler(event: LambdaEvent<Request>) -> Result<Response, Error> {
    // Derive the options, bucket, object, time?
    let client_opts = Opts {
        bucket: event.payload.bucket,
        object: event.payload.object,
        expires_in: event.payload.time,
    };

    let presigned_url = get_presigned_request(&client_opts).await?;

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
