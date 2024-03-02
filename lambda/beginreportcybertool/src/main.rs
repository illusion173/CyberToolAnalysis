mod types;
use types::*;
mod embedding;
mod rank_tools;
pub use rank_tools::*;
mod db_wrapper;
pub use db_wrapper::*;

use anyhow::{anyhow, Error};
use aws_sdk_dynamodb::Client as DynamoClient;
use lambda_http::{run, service_fn, Body, Request, Response};
use std::time::Instant;
use tracing::info;

#[allow(unused_macros)]
macro_rules! dump {
    ($a:ident) => {
        return Ok(format!("{:?}", $a));
    };
    () => {};
}

#[test]
fn print_rec_request() {
    let a = RecommendationRequest::default();
    println!("{}", serde_json::to_string_pretty(&a).unwrap());
    panic!();
}

async fn function_handler(event: Request) -> Result<String, Error> {
    let body_str = std::str::from_utf8(event.body().as_ref())
        .map_err(|e| anyhow!("Request is not valid utf8: {e:?}"))?;

    let request: RecommendationRequest =
        serde_json::from_str(body_str).map_err(|e| anyhow!("Failed to parse json body: {e:?}"))?;

    info!("Parsed request: {:?}", request);

    let config = aws_config::load_from_env().await;
    let db_client = DynamoClient::new(&config);

    let tools = get_tools_in_industry(&db_client, request.responses.industry).await?;

    let ranked_tools = get_tool_rankings(&db_client, &request, tools).await?;

    // TODO: generate pdf from tools
    // TODO: upload pdf to s3

    // Return tools and their score for now
    let s = format!(
        "{:?}",
        ranked_tools
            .iter()
            .map(|(t, score)| format!("{}: {score}", t.name))
            .collect::<Vec<_>>()
    );

    Ok(s)
}

async fn raw_function_handler(event: Request) -> Result<Response<Body>, lambda_http::Error> {
    let start = Instant::now();
    let r = function_handler(event).await;
    let time_taken = start.elapsed();
    let (code, status) = match r {
        Ok(msg) => (200, Ok(msg)),
        Err(e) => (200, Err(e.to_string())),
    };
    let body = RecommendToolsResponse { status, time_taken };

    Ok(Response::builder()
        .status(code)
        .header("content-type", "text/html")
        .header("Access-Control-Allow-Origin", "*")
        .body(
            serde_json::to_string(&body)
                .expect("Failed to serailize json response")
                .into(),
        )
        .expect("failed to build body"))
}

#[tokio::main]
async fn main() -> Result<(), lambda_http::Error> {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        .with_target(false)
        .without_time()
        .init();

    run(service_fn(raw_function_handler)).await
}
