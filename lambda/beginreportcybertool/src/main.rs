mod types;
use types::*;

use anyhow::{anyhow, Error};
use aws_sdk_dynamodb::types::{AttributeValue, ComparisonOperator, Condition};
use aws_sdk_dynamodb::Client as DynamoClient;
use lambda_http::{run, service_fn, Body, Request, Response};
use std::cmp::Ordering;
use std::collections::HashMap;
use std::time::Instant;
use tracing::info;

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
    let dynamo_client = DynamoClient::new(&config);

    let mut conditions = HashMap::new();
    conditions.insert(
        "Tool_Function".to_owned(),
        Condition::builder()
            .attribute_value_list(AttributeValue::S("Log_Analysis".to_owned()))
            .comparison_operator(ComparisonOperator::Eq)
            .build()
            .map_err(|e| anyhow!("Failed to build condition: {e:?}"))?,
    );

    let results = dynamo_client
        .query()
        .table_name("Cyber_Tools")
        .set_key_conditions(Some(conditions))
        .send()
        .await
        .map_err(|e| anyhow!("Failed to query database: {e:?}"))?;
    let items = results
        .items
        .ok_or_else(|| anyhow!("No items found in database query"))?;

    let mut tool_rows: Vec<ToolRow> = serde_dynamo::from_items(items)?;

    // Hide non-approved tools
    tool_rows.retain(|i| i.approved.unwrap_or(true));

    // scores start at 0 by default
    let mut scores: Vec<_> = tool_rows.into_iter().map(|t| (t, 0.0)).collect();

    // perform cloud heuristic
    for (t, score) in &mut scores {
        if let Some(true) = t.cloud_capable {
            match request.responses.cloud_reliance {
                CloudReliance::Heavily => *score += 1.0,
                CloudReliance::Partially => *score += 0.5,
                CloudReliance::Minimal => *score += 0.25,
                CloudReliance::None => {}
            }
        }
    }

    // perform aviation specific heuristic
    for (t, score) in &mut scores {
        if let Some(true) = t.aviation_apecific {
            if let Industry::AviationFocusedTools = request.responses.industry {
                *score += 1.0;
            }
        }
    }

    // Rank by score
    scores.sort_unstable_by(|(_, score1), (_, score2)| {
        (*score1).partial_cmp(score2).unwrap_or(Ordering::Equal)
    });

    dump!(scores);
}

// Steps:
// 1. Parse http request body into `FileData` containing result of form
// 2. Get all tools from database
// 3. Compare each tool with input form using heuristic to find best matching tools
// 5. Store generated pdf into s3
// 6. Return s3 pdf path in body of responce so frontend can download
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
