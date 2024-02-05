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
        print("HERE!")
        response = table.scan(Limit=PAGELIMIT)

    if exclusive_start_key is None and filter_expression:
        print("HERE 1!")
        response = table.scan(Limit=PAGELIMIT,FilterExpression=filter_expression)

    if filter_expression is None and exclusive_start_key:
        print("HERE 2!")
        response = table.scan(Limit=PAGELIMIT,ExclusiveStartKey=exclusive_start_key)

    if exclusive_start_key and filter_expression:
        print("HERE 3!")
        response = table.scan(Limit=PAGELIMIT,ExclusiveStartKey=exclusive_start_key,FilterExpression=filter_expression)


    #print(response)
    #print(type(response))
    '''

    if exclusive_start_key is None:
        if filter_expression is None:
        else:
            response = table.scan(Limit=PAGELIMIT,FilterExpression=filter_expression)
    else:
        if filter_expression is None:
            response = table.scan(Limit=PAGELIMIT,ExclusiveStartKey=exclusive_start_key)
        else:
            response = table.scan(Limit=PAGELIMIT,ExclusiveStartKey=exclusive_start_key,FilterExpression=filter_expression)

    '''

    items = response.get('Items', None)
    tool_list = []
    for item in items:
        if 'Customers' in item:
            item['Customers'] = list(item['Customers'])
        item = convert_decimal_to_int(item)
        tool_list.append(item)

    last_evaluated_key_json = response.get('LastEvaluatedKey', None)
    return tool_list, last_evaluated_key_json

def lambda_handler(event, context):
    # Extracting data from the HTTP request
    request_body_str = event.get('body', None)

    request_body_json = json.loads(request_body_str)

    # Placeholder response
    response = {}
    last_evaluated_key = {}

    if request_body_json is None:
        response['statusCode'] = 400
        response['headers'] = {"Content-Type": "application/json"}
        response['body'] = json.dumps({
            "errorMsg": "No request_body_json!",
            })
        return response   
    #Prepare scan_input
    scan_input = prepare_scan_input(request_body_json)

    tool_list, last_evaluated_key = getDashboardToolData(scan_input)

    response['statusCode'] = 200
    response['headers'] = {"Content-Type": "application/json"}
    response['body'] = json.dumps({
        "tool_list": tool_list,
        "last_evaluated_key": last_evaluated_key
        })
    print("DONE!")

    #print(response)
    return response
