use aws_sdk_dynamodb::types::AttributeValue;
use aws_sdk_dynamodb::Client as DynamoClient;
use lambda_http::{run, service_fn, Body, Error, Request, Response};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

const FILETABLENAME: &str = "ReportLocationTable";

#[derive(Serialize, Deserialize, Debug)]
struct UserData {
    user_identifier: String,
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Eq)]
pub struct ReportRow {
    user_identifier: String,
    report_id: String,
    date_made: String,
    file_name: String,
}

fn as_string(val: Option<&AttributeValue>, default: &String) -> String {
    if let Some(v) = val {
        if let Ok(s) = v.as_s() {
            return s.to_owned();
        }
    }
    default.to_owned()
}

impl ReportRow {
    pub fn new(
        user_identifier: String,
        report_id: String,
        date_made: String,
        file_name: String,
    ) -> Self {
        ReportRow {
            user_identifier,
            report_id,
            date_made,
            file_name,
        }
    }
}

impl From<&HashMap<String, AttributeValue>> for ReportRow {
    fn from(value: &HashMap<String, AttributeValue>) -> Self {
        let report_row = ReportRow::new(
            as_string(value.get("user_id"), &"".to_string()),
            as_string(value.get("report_id"), &"".to_string()),
            as_string(value.get("date_made"), &"".to_string()),
            as_string(value.get("file_name"), &"".to_string()),
        );

        report_row
    }
}

async fn get_report_list(user_identifier: String) -> Result<Vec<ReportRow>, Error> {
    let config = aws_config::load_from_env().await;
    let dynamo_client = DynamoClient::new(&config);

    let partition_key_value_user_identifier = AttributeValue::S(user_identifier);
    let results = dynamo_client
        .query()
        .table_name(FILETABLENAME)
        .key_condition_expression("user_id = :val")
        .expression_attribute_values(":val", partition_key_value_user_identifier)
        .send()
        .await?;

    if let Some(items) = results.items {
        let rows = items.iter().map(|v| v.into()).collect();
        Ok(rows)
    } else {
        // ERROR! No items found.
        Ok(vec![])
    }
}

async fn function_handler(event: Request) -> Result<Response<Body>, Error> {
    let body_str = match std::str::from_utf8(event.body().as_ref()) {
        Ok(body_str) => body_str,
        Err(_error) => {
            return Ok(Response::builder()
                .header("Access-Control-Allow-Origin", "*")
                .status(400)
                .body(Body::from("Unable to derive request body, utf-8 error?"))
                .expect("Failed to build a response"))
        }
    };
    let user_data_struct: UserData = match serde_json::from_str(body_str) {
        Ok(user_data_struct) => user_data_struct,
        Err(_error) => {
            return Ok(Response::builder()
                .header("Access-Control-Allow-Origin", "*")
                .status(400)
                .body(Body::from(
                    "Invalid Request Body, missing file_name or user data.",
                ))
                .expect("Failed to build a response, file_data_structure."))
        }
    };

    let report_vector = get_report_list(user_data_struct.user_identifier).await?;

    if report_vector.is_empty() {
        return Ok(Response::builder()
            .header("Access-Control-Allow-Origin", "*")
            .status(400)
            .body(Body::from("No Reports For User."))
            .expect("Failed to build a response"));
    }

    let serialized_report_list = serde_json::to_string(&report_vector)?;

    let resp = Response::builder()
        .status(200)
        .header("content-type", "text/html")
        .header("Access-Control-Allow-Origin", "*")
        .body(serialized_report_list.into())
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
