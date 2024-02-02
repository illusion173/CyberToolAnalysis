use aws_sdk_dynamodb::types::AttributeValue;
use aws_sdk_dynamodb::{Client as DynamoClient, Error};
use lambda_http::{run, service_fn, Body, Error, Request, RequestExt, Response};
use serde::{Deserialize, Serialize};
use serde_json;
use std::collections::HashMap;

#[derive(Serialize, Deserialize, Debug)]
struct LastKey {
    last_exclusive_key: String,
}
#[derive(Debug, Serialize, Deserialize, PartialEq, Eq)]
pub struct ToolRow {
    Tool_Function: String,
    Tool_ID: String,
    Tool_Name: String,
}

impl ToolRow {
    pub fn new(Tool_Function: String, Tool_ID: String, Tool_Name: String) -> Self {
        ToolRow {
            Tool_Function,
            Tool_ID,
            Tool_Name,
        }
    }
}

#[derive(Debug)]
pub struct ToolResponse {
    tools: Vec<ToolRow>,
    last_evaluated_key: HashMap<std::string::String, AttributeValue>,
}

fn as_string(val: Option<&AttributeValue>, default: &String) -> String {
    if let Some(v) = val {
        if let Ok(s) = v.as_s() {
            return s.to_owned();
        }
    }
    default.to_owned()
}

impl From<&HashMap<String, AttributeValue>> for ToolRow {
    fn from(value: &HashMap<String, AttributeValue>) -> Self {
        let tool_row = ToolRow::new(
            as_string(value.get("Tool_Function"), &"".to_string()),
            as_string(value.get("Tool_ID"), &"".to_string()),
            as_string(value.get("Tool_Name"), &"".to_string()),
        );
        tool_row
    }
}

async fn get_next_page_tools(
    last_evaluated_key: HashMap<std::string::String, AttributeValue>,
) -> (Result<ToolResponse, Error>) {
    let config = aws_config::load_from_env().await;

    let dynamo_client = DynamoClient::new(&config);

    let page_size = 10;

    let scan_output_response = dynamo_client
        .scan()
        .table_name(TOOLTABLENAME)
        .set_exclusive_start_key(exclusive_start_key)
        .limit(page_size)
        .send()
        .await?;

    if let Some(items) = scan_output_response.items.clone() {
        let rows = items.iter().map(|v| v.into()).collect();

        let last_evaluated_key_item = scan_output_response.last_evaluated_key().unwrap();

        let response = ToolResponse {
            tools: rows,
            last_evaluated_key: last_evaluated_key_item.clone(),
        };
        Ok(response)
    } else {
        // ERROR! No items found.
        panic!("Error while getting Tool rows from DynamoDB");
    }

    Ok(())
}

async fn function_handler(event: Request) -> Result<Response<Body>, Error> {
    // Receive all data
    //
    //
    //
    // Get Initial Body string from request
    let body_str = match std::str::from_utf8(event.body().as_ref()) {
        Ok(body_str) => body_str,
        Err(_error) => {
            return Ok(Response::builder()
                .status(400)
                .body(Body::from("Unable to derive request body, utf-8 error?"))
                .expect("Failed to build a response"))
        }
    };

    // Cast it to a struct
    let last_key_struct: LastKey = match serde_json::from_str(body_str) {
        Ok(LastKey_struct) => LastKey_struct,
        Err(_error) => {
            return Ok(Response::builder()
                .status(400)
                .body(Body::from(
                    "Invalid Request Body, missing last_exclusive_key input",
                ))
                .expect("Failed to build a response, check lambda?."))
        }
    };

    let list_items_result_struct = get_next_page_tools(last_key_struct.last_exclusive_key).await?;
    // Poorly format the data LOL
    let tool_string = format!("{:?}", list_items_result_struct);

    let resp = Response::builder()
        .status(200)
        .header("content-type", "text/html")
        .body(message.into())
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
