mod types;
use types::*;

use anyhow::{anyhow, Error};
use aws_sdk_dynamodb::types::{AttributeValue, Condition};
use aws_sdk_dynamodb::Client as DynamoClient;
use futures_util::FutureExt;
use lambda_http::{run, service_fn, Body, Request, Response};
use std::panic::AssertUnwindSafe;
use tracing::info;

macro_rules! dump {
    ($a:ident) => {
        let s = $a;
        return Ok(format!("Lambda returned: {s:?}"));
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
    let dynamo_client = DynamoClient::new(&config);

    let results = dynamo_client
        .query()
        .table_name("Cyber_Tools")
        //.get_key_condition_expression("Tool_Function", Condition::)
        .key_condition_expression(" = :Log_Analysis")
        .send()
        .await
        .map_err(|e| anyhow!("Failed to query database: {e:?}"))?;

    dump!(results);
}

// Steps:
// 1. Parse http request body into `FileData` containing result of form
// 2. Get all tools from database
// 3. Compare each tool with input form using heuristic to find best matching tools
// 5. Store generated pdf into s3
// 6. Return s3 pdf path in body of responce so frontend can download
async fn raw_function_handler(event: Request) -> Result<Response<Body>, lambda_http::Error> {
    let result = async {
        Ok(match function_handler(event).await {
            Ok(body) => Response::builder()
                .status(200)
                .header("content-type", "text/html")
                .header("Access-Control-Allow-Origin", "*")
                .body(body.into())
                .expect("failed to build body"),
            Err(e) => Response::builder()
                .status(400)
                .body(e.to_string().into())
                .expect("failed to build body"),
        })
    }
    .await;

    result

    /*
    match result {
        Ok(r) => r,
        Err(e) => Ok(Response::builder()
            .status(400)
            .body(format!("Lambda panicked: {e:?}").into())
            .expect("failed to build body")),
    }
    */
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
