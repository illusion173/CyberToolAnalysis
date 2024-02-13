import boto3
from boto3.dynamodb.conditions import Key

import json
import simplejson
def getSingularToolData(prepared_input: dict):

    # Create DynamoDB client
    dynamodb_resource = boto3.resource('dynamodb')
    
    # Specify the table name
    table_name = 'Cyber_Tools'

    table_data = dynamodb_resource.Table(table_name)

    primary_key = prepared_input.get("tool_function", None)
    secondary_key = prepared_input.get("tool_id", None)

    if primary_key is None or secondary_key is None:
        return {
                "errorMsg" : "Missing primary key input, secondary key input.",
                "statusCode" : 400
                }
    try:
        # Perform the query
        response = table_data.query(
            TableName=table_name,
            KeyConditionExpression=Key('Tool_Function').eq(primary_key) & Key('Tool_ID').eq(secondary_key)
        )

        # Handle the response
        items = response.get('Items', None)

        if items:
            # Convert sets to lists in items_dict
            items_dict = items[0]
            for key, value in items_dict.items():
                if isinstance(value, set):
                    items_dict[key] = list(value)
            return items_dict  # Return the modified items_dict if it exists
        else:
            return {"errorMsg":"No data for this item?", "statusCode":500} # Return an empty dictionary if items is empty

    except Exception as e:
        # Handle any errors
        print(f"Error: {e}")

        return {
                "errorMsg" : e,
                "statusCode" : 500
                }


def lambda_handler(event, context):
    # Extracting data from the HTTP request
    request_body_str = event.get('body', None)
    request_body_json = json.loads(request_body_str)

    # Placeholder response
    response = {}

    if request_body_json:
        singular_tool_data = getSingularToolData(request_body_json)
        response['statusCode'] = 200
    else:
        singular_tool_data = "No Tool Data Request Inputted!"
        response['statusCode'] = 400

    response['headers'] = {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"}
    response['body'] = simplejson.dumps(singular_tool_data, use_decimal=True)

    return response
