use aws_config::meta::region::RegionProviderChain;
use aws_sdk_dynamodb::Client;
use lambda_runtime::{handler_fn, Context, Error as LambdaError};
use serde::Deserialize;
use serde_json::{json, Value};
use uuid::Uuid;

#[tokio::main]
async fn main() -> Result<(), LambdaError> {
    let func = handler_fn(handler);
    lambda_runtime::run(func).await?;
    Ok(())
}

#[derive(Deserialize)]
struct CustomEvent {
    first_name: String,
    last_name: String,
}

async fn handler(event: CustomEvent, _: Context) -> Result<Value, LambdaError> {
    let region_provider = RegionProviderChain::default_provider().or_else("us-east-1");
    let config = aws_config::from_env().region(region_provider).load().await;

    println!("Hello!");

    Ok(json!({ "message": "Record written!" }))
}
