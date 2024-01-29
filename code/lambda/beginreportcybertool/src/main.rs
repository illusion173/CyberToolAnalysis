use aws_sdk_sfn as sfn;
use lambda_http::{run, service_fn, Body, Error, Request, Response};
use serde::{Deserialize, Serialize};
#[derive(Serialize, Deserialize, Debug)]
struct FileData {
    file_name: String,
    user_identifier: String,
    responses: QuestionnaireData,
}

#[derive(Serialize, Deserialize, Debug)]
struct QuestionnaireData {
    question_1: String,
    question_2: String,
    question_3: String,
    question_4: String,
    question_5: String,
    question_6: String,
    question_7: String,
    question_8: String,
    question_9: String,
    question_10: String,
    question_11: String,
    question_12: String,
    question_13: String,
    question_14: String,
    question_15: String,
}
async fn function_handler(event: Request) -> Result<Response<Body>, Error> {
    let body_str = match std::str::from_utf8(event.body().as_ref()) {
        Ok(body_str) => body_str,
        Err(_error) => {
            return Ok(Response::builder()
                .status(400)
                .body(Body::from("Unable to derive request body, utf-8 error?"))
                .expect("Failed to build a response"))
        }
    };

    let file_data_struct: FileData = match serde_json::from_str(body_str) {
        Ok(file_data_struct) => file_data_struct,
        Err(_error) => {
            return Ok(Response::builder()
                .status(400)
                .body(Body::from(
                    "Invalid Request Body, missing file_name or user data.",
                ))
                .expect("Failed to build a response, file_data_structure."))
        }
    };

    let serialized_file_data_struct = serde_json::to_string(&file_data_struct).unwrap();

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

    let message = "Success, report being created.".to_string();
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
