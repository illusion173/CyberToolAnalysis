import boto3
import json
from botocore.exceptions import ClientError

# Initialize a DynamoDB client
dynamodb = boto3.resource('dynamodb')

def lambda_handler(event, context):
    table_name = 'Cyber_Tools'
    table = dynamodb.Table(table_name)
    
    try:
        # Parse the JSON-formatted string from event['body'] to a Python dictionary
        item = json.loads(event['body'])

        if 'Customers' in item:
            item['Customers'] = set(item['Customers'])
        
        item["Approved"] = False
        
        # Attempt to insert the parsed and potentially modified item into the DynamoDB table
        response = table.put_item(Item=item)
        
        # If the insert is successful, return a success status code
        return {
            'statusCode': 200,
            'headers': {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
            'body': json.dumps('Data inserted successfully, pending acceptance')
        }

    except ClientError as e:
        # If an error occurs, print the error and return a failure status code
        print(e.response['Error']['Message'])
        return {
            'statusCode': 500,
            'headers': {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
            'body': json.dumps('An error occurred: ' + e.response['Error']['Message'])
        }
    except json.JSONDecodeError:
        # Handle the case where event body is not in valid JSON format
        return {
            'statusCode': 400,
            'headers': {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
            'body': json.dumps('Invalid JSON format in request body')
        }
