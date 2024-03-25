import boto3
import pandas as pd

# Initialize a DynamoDB client
dynamodb = boto3.resource("dynamodb")

# Specify your DynamoDB table name
table_name = "Cyber_Tools"
table = dynamodb.Table(table_name)

# Load the CSV file
csv_file_path = "tool_data.csv"
df = pd.read_csv(csv_file_path, skiprows=1)  # skip the header row

# Iterate through each row in the DataFrame and put the item in DynamoDB
for index, row in df.iterrows():

    dynamo_item = {
        "Tool_Function": row["Tool_Function"],
        "Tool_ID": row["Tool_ID"],
        "Tool_Name": row["Tool_Name"],
        "Company": row["Company"],
        "Tool_URL": row["Tool_URL"],
        "Phone": row["Phone"],
        "Device": row["Device"],
        "Launched": row["Launched"],
        "Requirements": row["Requirements"],
        "Features": row["Features"],
        "Accuracy": row["Accuracy"],
        "Documentation_Link": row["Documentation_Link"],
        "Keywords": (
            row["Keywords"].split(", ") if pd.notnull(row["Keywords"]) else []
        ),  # Splitting and handling null
        "Description": row["Description"],
        "AI/ML_Use": row["AI/ML_Use"] == "TRUE",
        "Cloud_Capable": row["Cloud_Capable"] == "TRUE",
        "Maturity_Level": (
            str(row["Maturity Level"]) if pd.notnull(row["Maturity Level"]) else None
        ),  # Handling null
        "ToolBox": row["ToolBox"],
        "Approved": row["Approved"],
        "Aviation_Specific": row["Aviation_Specific"],
    }

    # Filter out null or NaN values to avoid errors
    # dynamo_item = {k: v for k, v in dynamo_item.items() if pd.notnull(v)}

    try:
        response = table.put_item(Item=dynamo_item)
        print(f"Successfully inserted: {dynamo_item['Tool_ID']}")
    except Exception as e:
        print(f"Failed to insert {dynamo_item['Tool_ID']}: {e}")
