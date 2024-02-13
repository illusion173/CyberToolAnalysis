import json
import boto3
from boto3.dynamodb.conditions import Attr
from decimal import Decimal

PAGELIMIT = 10

def convert_decimal_to_int(item):
    """
    Recursively converts Decimal instances to int in a dictionary.
    """
    if isinstance(item, Decimal):
        return int(item)
    elif isinstance(item, dict):
        return {key: convert_decimal_to_int(value) for key, value in item.items()}
    elif isinstance(item, list):
        return [convert_decimal_to_int(element) for element in item]
    else:
        return item

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


    if not last_evaluated_key_json:
        last_evaluated_key = None
    else:
        last_evaluated_key = last_evaluated_key_json

    # Create formal input
    prepared_input = {
            "ExclusiveStartKey": last_evaluated_key,
            "FilterExpression": filter_expression,
            }

    return prepared_input

def getDashboardToolData(scan_input: dict):

    # Create DynamoDB client
    dynamodb = boto3.resource('dynamodb')
    
    # Specify the table name
    table_name = 'Cyber_Tools'
    
    # Reference the table
    table = dynamodb.Table(table_name)

    exclusive_start_key = scan_input['ExclusiveStartKey']

    filter_expression =  scan_input['FilterExpression']

    response = {}
    if exclusive_start_key is None and filter_expression is None:
        response = table.scan(Limit=PAGELIMIT)

    if exclusive_start_key is None and filter_expression:
        response = table.scan(Limit=PAGELIMIT,FilterExpression=filter_expression)

    if filter_expression is None and exclusive_start_key:
        response = table.scan(Limit=PAGELIMIT,ExclusiveStartKey=exclusive_start_key)

    if exclusive_start_key and filter_expression:
        response = table.scan(Limit=PAGELIMIT,ExclusiveStartKey=exclusive_start_key,FilterExpression=filter_expression)


    items = response.get('Items', None)

    tool_list = []

    for item in items:
        item['Customers'] = list(item['Customers']) if isinstance(item.get('Customers'), set) else item.get('Customers')
        item['Keywords'] = list(item['Keywords']) if isinstance(item.get('Keywords'), set) else item.get('Keywords')
        
        new_item = convert_decimal_to_int(item)
        tool_list.append(new_item)
   
    last_evaluated_key_json = response.get('LastEvaluatedKey', None)
    return tool_list, last_evaluated_key_json

def lambda_handler(event, context):
    """
    AWS Lambda handler function for fetching a user's requested dashboard of tools.
    either returns nothing,
    or returns a json obj with two items: list, json obj
    """
    # Extracting data from the HTTP request
    request_body_str = event.get('body')
    
    if not request_body_str:
        return {
            'statusCode': 400,
            'headers': {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
            'body': json.dumps({"errorMsg": "No request_body_json!"})
        }

    request_body_json = json.loads(request_body_str)

    # Prepare scan input
    scan_input = prepare_scan_input(request_body_json)

    # Retrieve dashboard tool data
    tool_list, last_evaluated_key = getDashboardToolData(scan_input)

    response = {
        'statusCode': 200,
        'headers': {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
        'body': json.dumps({
            "tool_list": tool_list,
            "last_evaluated_key": last_evaluated_key
        })
    }

    return response
