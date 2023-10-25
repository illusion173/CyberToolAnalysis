
use aws_sdk_sfn as sfn;
use lambda_http::{run, service_fn, Body, Error, Request, RequestExt, Response};
use serde::{Deserialize, Serialize};
/// This is the main body for the function.
/// Write your code inside it.
/// There are some code example in the following URLs:
/// - https://github.com/awslabs/aws-lambda-rust-runtime/tree/main/examples
///
///
#[derive(Serialize, Deserialize)]
struct FileData {
    file_name: String,
    cognito_user_data: String,
}
async fn function_handler(event: Request) -> Result<Response<Body>, Error> {
    // Extract some useful information from the request
    let file_name = event
        .query_string_parameters_ref()
        .and_then(|params| params.first("file_name"))
        .unwrap();
    let cognito_user_data = event
        .query_string_parameters_ref()
        .and_then(|params| params.first("cognito_user_data"))
        .unwrap();

    let file_data_struct = FileData {
        file_name: file_name.to_string(),
        cognito_user_data: cognito_user_data.to_string(),
    };

    let serialized_file_data_struct = serde_json::to_string(&file_data_struct).unwrap();

    let message = "SUCCESS! Report Being Created Now.".to_string();

    // Begin Report Step Function

    let config = aws_config::load_from_env().await;
    let sfn_client = sfn::Client::new(&config);
    sfn_client
        .start_execution()
        .state_machine_arn(
            "arn:aws:states:us-east-1:417838760454:stateMachine:StateMachineReportCyberTool",
        )
        .input(serialized_file_data_struct)
        .send()
        .await?;

    // Return something that implements IntoResponse.
    // It will be serialized to the right response event automatically by the runtime
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
