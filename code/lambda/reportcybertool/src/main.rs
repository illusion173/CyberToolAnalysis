use lambda_runtime::{run, service_fn, Error, LambdaEvent};
use serde::{Deserialize, Serialize};

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

async fn function_handler(event: LambdaEvent<Request>) -> Result<Response, Error> {
    // Prepare the response
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
