use aws_sdk_dynamodb::types::AttributeValue;
use aws_sdk_dynamodb::Client as DynamoClient;
use lambda_http::{run, service_fn, Body, Error, Request, Response};
use serde::{Deserialize, Serialize, Serializer};
use serde_dynamo;
use serde_json;
use std::collections::HashMap;
const TOOLTABLENAME: &str = "Cyber_Tools";

#[derive(Debug, Serialize, Deserialize)]
struct DashboardRequest {
    last_evaluated_key_input: Option<HashMap<String, String>>,
    filter: Option<HashMap<String, String>>,
    first_load: Option<bool>,
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Eq)]
pub struct ToolRow {
    Tool_Function: String,
    Tool_ID: String,
    Tool_Name: String,
}

#[derive(Debug)]
pub struct ToolResponse {
    tools: Vec<ToolRow>,
    last_evaluated_key: HashMap<String, AttributeValue>,
}

async fn load_default_list() -> Result<ToolResponse, Error> {
    let config = aws_config::load_from_env().await;

    let dynamo_client = DynamoClient::new(&config);

    let page_size = 10;

    let scan_output_response = dynamo_client
        .scan()
        .table_name(TOOLTABLENAME)
        .limit(page_size)
        .send()
        .await?;

    let items = scan_output_response.items().to_vec().clone();
    let tool_rows: Vec<ToolRow> = serde_dynamo::from_items(items)?;
    let last_key = scan_output_response.last_evaluated_key().unwrap().clone();

    Ok(ToolResponse {
        tools: tool_rows,
        last_evaluated_key: last_key,
    })
}

async fn load_list_next_page(
    last_evaluated_key: HashMap<String, String>,
) -> Result<ToolResponse, Error> {
    let config = aws_config::load_from_env().await;

    let dynamo_client = DynamoClient::new(&config);

    let page_size = 10;

    let scan_output_response = dynamo_client
        .scan()
        .table_name(TOOLTABLENAME)
        .limit(page_size)
        .exclusive_start_key()
        .send()
        .await?;

    let items = scan_output_response.items().to_vec().clone();
    let tool_rows: Vec<ToolRow> = serde_dynamo::from_items(items)?;
    let last_key = scan_output_response.last_evaluated_key().unwrap().clone();

    Ok(ToolResponse {
        tools: tool_rows,
        last_evaluated_key: last_key,
    })
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

    // Serialize into
    let file_request_struct: DashboardRequest = match serde_json::from_str(body_str) {
        Ok(file_request_struct) => file_request_struct,
        Err(_error) => {
            return Ok(Response::builder()
                .status(400)
                .body(Body::from("Invalid Request Body, missing report_id"))
                .expect("Failed to build a response, report_id_struct."))
        }
    };

    // Receive all data
    // Poorly format the data LOL
    let tool_string = format!("AAA");

    let resp = Response::builder()
        .status(200)
        .header("content-type", "text/html")
        .body(tool_string.into())
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
