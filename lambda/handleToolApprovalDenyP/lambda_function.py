import json
import boto3
from botocore.exceptions import ClientError



def approve_tool(tool_id, tool_function):
    dynamodb = boto3.resource('dynamodb')
    table_name = 'YourTableName'
    table = dynamodb.Table(table_name)

    try:
        response = table.update_item(
            Key={'tool_id': tool_id, 'tool_function': tool_function},
            UpdateExpression='SET Approved = :val',
            ExpressionAttributeValues={':val': True},
            ReturnValues="UPDATED_NEW"
        )
        return generate_response(200, {"message": "Tool approved successfully."})
    except ClientError as e:
        return generate_response(e.response['ResponseMetadata']['HTTPStatusCode'], {"errorMsg": e.response['Error']['Message']})
    except Exception as e:
        return generate_response(500, {"errorMsg": str(e)})

def deny_tool(tool_id, tool_function):
    dynamodb = boto3.resource('dynamodb')
    table_name = 'YourTableName'
    table = dynamodb.Table(table_name)

    try:
        response = table.delete_item(
            Key={'tool_id': tool_id, 'tool_function': tool_function}
        )
        return generate_response(200, {"message": "Tool denied and deleted successfully."})
    except ClientError as e:
        return generate_response(e.response['ResponseMetadata']['HTTPStatusCode'], {"errorMsg": e.response['Error']['Message']})
    except Exception as e:
        return generate_response(500, {"errorMsg": str(e)})

def generate_response(status_code, body):
    """
    Helper function to generate HTTP response with a given status code and body.
    """
    return {
        'statusCode': status_code,
        'headers': {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
        'body': json.dumps(body)
    }

def lambda_handler(event, context):
# Extract action from the event body
    request_body_str = event.get('body')
    if not request_body_str:
        return generate_response(400, {"errorMsg": "No request body provided!"})

    try:
        request_body_json = json.loads(request_body_str)
        tool_id = request_body_json.get("tool_id")
        tool_function = request_body_json.get("tool_function")
        action = request_body_json.get("action")  # Expecting "approve" or "deny"

        if not tool_id or not tool_function or not action:
            return generate_response(400, {"errorMsg": "Missing required parameters!"})

        if action == "approve":
            return approve_tool(tool_id, tool_function)
        elif action == "deny":
            return deny_tool(tool_id, tool_function)
        else:
            return generate_response(400, {"errorMsg": "Invalid action specified!"})

    except Exception as e:
        return generate_response(500, {"errorMsg": str(e)})
