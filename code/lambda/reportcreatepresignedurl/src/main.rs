use aws_sdk_s3::presigning::PresigningConfig;
use aws_sdk_s3::Client as S3Client;
use lambda_http::{run, service_fn, Body, Error, Request, Response};
use serde::{Deserialize, Serialize};
use std::time::Duration;

#[derive(Deserialize, Debug, Clone)]
struct RequestReport {
    report_id: String,
}

#[derive(Deserialize, Serialize)]
struct ResponseLambda {
    status_code: u32,
    url: String,
}

const REPORTBUCKET: &str = "reportcybertool-cs490";

async fn get_presigned_request(client_opts: RequestReport) -> Result<String, Error> {
    // Get config from env
    let config = aws_config::load_from_env().await;
    // Create a new s3 client
    let client = S3Client::new(&config);
    let expires_in = Duration::from_secs(604800);
    // Generate request & send, await feedback
    //
    let full_report_key = format!("reports/{}", &client_opts.report_id);
    let presigned_request = client
        .get_object()
        .bucket(REPORTBUCKET)
        .key(full_report_key)
        .presigned(PresigningConfig::expires_in(expires_in)?)
        .await?;
    // When presigned_url dont, get url convert to string.
    let url = presigned_request.uri().to_string();
    Ok(url)
}

async fn function_handler(event: Request) -> Result<Response<Body>, Error> {
    // Extract body string from event
    let body_str = match std::str::from_utf8(event.body().as_ref()) {
        Ok(body_str) => body_str,
        Err(_error) => {
            return Ok(Response::builder()
                .status(400)
                .body(Body::from("Unable to derive request body, utf-8 error?"))
                .expect("Failed to build a response"))
        }
    };

    // Serialize into Request Report struct and get report_id
    let file_request_struct: RequestReport = match serde_json::from_str(body_str) {
        Ok(file_request_struct) => file_request_struct,
        Err(_error) => {
            return Ok(Response::builder()
                .status(400)
                .body(Body::from("Invalid Request Body, missing report_id"))
                .expect("Failed to build a response, report_id_struct."))
        }
    };

    let presigned_url_message = get_presigned_request(file_request_struct).await?;

    // Return back with url
    let resp = Response::builder()
        .status(200)
        .header("content-type", "text/html")
        .body(presigned_url_message.into())
        .map_err(Box::new)?;
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
