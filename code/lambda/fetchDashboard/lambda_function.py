import json
import boto3
from boto3.dynamodb.conditions import Attr

class LambdaResponse:
    def __init__(self, toolList: list, last_evaluated_key: dict):

        self.toolList = toolList
        self.last_evaluated_key = last_evaluated_key


def prepare_scan_input(request_body: dict) -> dict:

    last_evaluated_key_json = request_body.get('last_evaluated_key', None)
    filter_input = request_body.get('filter_input', None)


    filter_expression = None
    if filter_input:
        for key, value in filter_input.items():
            condition = Attr(key).eq(value)
            if filter_expression is None:
                filter_expression = condition
            else:
                filter_expression &= condition

    # Create formal input
    prepared_input = {
            "Limit": 10,
            "ExclusiveStartKey": last_evaluated_key_json,
            "FilterExpression": filter_expression,
            }

    return prepared_input

def getDashboardToolData(scan_input: dict) -> LambdaResponse:

    # Create DynamoDB client
    dynamodb = boto3.resource('dynamodb')
    
    # Specify the table name
    table_name = 'Cyber_Tools'
    
    # Reference the table
    table = dynamodb.Table(table_name)

    if scan_input.get('ExclusiveStartKey') is None:
    # Perform the scan operation
        response = table.scan(Limit=scan_input['Limit'],FilterExpression=scan_input.get('FilterExpression', None))
    else:
        response = table.scan(Limit=scan_input['Limit'], ExclusiveStartKey=scan_input.get('ExclusiveStartKey', None),FilterExpression=scan_input.get('FilterExpression', None))
    # Extract items from the response
    
    # Items can have nothing insied of it 
    items = response.get('Items', None)
    
    # Retrieve the last evaluated key, can be none
    last_evaluated_key_json = response.get('LastEvaluatedKey', None)
    
    newLambdaResponse = LambdaResponse(toolList=items, last_evaluated_key=last_evaluated_key_json)

    return newLambdaResponse


def lambda_handler(event, context):
    # Extracting data from the HTTP request
    http_method = event['httpMethod']
    request_body = event.get('body', None)

    # Placeholder response
    response = {}

    # Handling different HTTP methods
    if http_method == 'POST':
        print("POST")

        if request_body is None:
            lambda_response = getDashboardToolData({})
        else:
            #Prepare scan_input
            scan_input = prepare_scan_input(request_body)

            lambda_response = getDashboardToolData(scan_input)

        response['statusCode'] = 200
        response['headers'] = {"Content-Type": "application/json"}
        response['body'] = {
            "tool_list": lambda_response.toolList,
            "last_evaluated_key": lambda_response.last_evaluated_key
            }
    else:
        # Return an error for unsupported HTTP methods
        response['statusCode'] = 405
        response['body'] = json.dumps({"error": "Method Not Allowed"})

    return response
