use aws_sdk_dynamodb::types::AttributeValue;
use aws_sdk_dynamodb::Client as DynamoClient;
use lambda_http::{run, service_fn, Body, Error, Request, RequestExt, Response};
use serde::{Deserialize, Serialize};
use serde_json;
use std::collections::HashMap;
const TOOLTABLENAME: &str = "Cyber_Tools";

#[derive(Debug, Serialize, Deserialize, PartialEq, Eq)]
pub struct ToolRequest {
    tool_function: String,
    tool_id: String,
}

async fn get_tool_data(tool_request_struct: ToolRequest) -> (Result<String, Error>) {
    let config = aws_config::load_from_env().await;

    let dynamo_client = DynamoClient::new(&config);
    // Perform the query
    let response = dynamo_client
        .query()
        .table_name(TOOLTABLENAME)
        .key_condition_expression("#tf = :Tool_Function AND #tid = :Tool_ID")
        .expression_attribute_names("#tf", "Tool_Function")
        .expression_attribute_names("#tid", "Tool_ID")
        .expression_attribute_values(
            ":Tool_Function",
            AttributeValue::S(tool_request_struct.tool_function.clone()),
        )
        .expression_attribute_values(
            ":Tool_ID",
            AttributeValue::S(tool_request_struct.tool_id.clone()),
        )
        .send()
        .await?;

    // GAH! Give up for now

    // Extract items from the response
    let items = match response.items {
        Some(items) => {
            let mut item_strings = Vec::new();
            for item in items {
                let mut item_string = String::new();
                for (key, value) in item.iter() {
                    let key_str = key.clone(); // Clone the key to get a String
                    let value_str = match value {
                        AttributeValue::S(s) => s.clone(), // Clone the String attribute value
                        AttributeValue::N(n) => n.clone(), // Clone the Numeric attribute value
                        _ => String::from("Unknown type"), // Handle other types if needed
                    };
                    item_string.push_str(&format!("Key: {}, Value: {}\n", key_str, value_str));
                }
                item_strings.push(item_string);
            }
            item_strings.join(", ")
        }
        None => "No items found".to_string(),
    };

    Ok(items)
}

async fn function_handler(event: Request) -> Result<Response<Body>, Error> {
    // Receive all data
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
    let tool_request_struct: ToolRequest = match serde_json::from_str(body_str) {
        Ok(tool_request_struct) => tool_request_struct,
        Err(_error) => {
            return Ok(Response::builder()
                .status(400)
                .body(Body::from(
                    "Invalid Request Body, missing tool_function or tool_id input",
                ))
                .expect("Failed to build a response, check lambda?."))
        }
    };

    let list_items_result_struct = get_tool_data(tool_request_struct).await?;
    // Poorly format the data LOL
    let tool_string = format!("{:?}", list_items_result_struct);

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
