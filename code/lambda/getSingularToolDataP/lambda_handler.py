import boto3
from boto3.dynamodb.conditions import Key
def getSingularToolData(prepared_input: dict):

    # Create DynamoDB client
    dynamodb_resource = boto3.resource('dynamodb')
    
    # Specify the table name
    table_name = 'Cyber_Tools'

    table_data = dynamodb_resource.Table(table_name)


    primary_key = prepared_input["tool_function"]
    secondary_key = prepared_input["tool_id"]

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
            return {}  # Return an empty dictionary if items is empty

    except Exception as e:
        # Handle any errors
        print(f"Error: {e}")
        return {}


def lambda_handler(event, context):
    # Extracting data from the HTTP request
    request_body = event.get('body', None)

    # Placeholder response
    response = {}

    if request_body:
        singular_tool_data = getSingularToolData(request_body)
    else:
        singular_tool_data = "No Tool Data Request Inputted!"

    response['body'] = singular_tool_data

    return response


'''
Local Test
lambda_handler({'body':{
    "tool_function" : "Log_Analysis",
    "tool_id" : "LA_00"
}},{})

'''
