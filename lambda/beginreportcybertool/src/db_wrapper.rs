use std::collections::HashMap;

use anyhow::{anyhow, Result};
use aws_sdk_dynamodb::types::{ComparisonOperator, Condition};
use aws_sdk_dynamodb::Client as DynamoClient;

use crate::types::*;

const TOOLS_TABLE_NAME: &str = "Cyber_Tools";

/// Returns all tools within the tools table that match `industry`
pub async fn get_tools_in_industry(
    db_client: &DynamoClient,
    industry: Industry,
) -> Result<Vec<ToolRow>> {
    let mut conditions = HashMap::new();

    let tool_function = serde_dynamo::to_attribute_value(&industry)
        .map_err(|e| anyhow!("Failed to serialize industry: {e:?}"))?;

    conditions.insert(
        "Tool_Function".to_owned(),
        Condition::builder()
            .attribute_value_list(tool_function)
            .comparison_operator(ComparisonOperator::Eq)
            .build()
            .map_err(|e| anyhow!("Failed to build condition: {e:?}"))?,
    );

    let results = db_client
        .query()
        .table_name(TOOLS_TABLE_NAME)
        .set_key_conditions(Some(conditions))
        .send()
        .await
        .map_err(|e| anyhow!("Failed to query database: {e:?}"))?;

    let items = results
        .items
        .ok_or_else(|| anyhow!("No items found in database query"))?;

    Ok(serde_dynamo::from_items(items)?)
}

pub async fn update_embedding(
    db_client: &DynamoClient,
    mut tool: ToolRow,
    embedding: Vec<f32>,
) -> Result<()> {
    tool.cached_sentence_embedding = Some(embedding).into();

    let item = serde_dynamo::to_item(&tool)
        .map_err(|e| anyhow!("Failed to serialize tool {tool:?}: {e:?}"))?;

    db_client
        .put_item()
        .table_name(TOOLS_TABLE_NAME)
        .set_item(Some(item))
        .send()
        .await
        .map_err(|e| anyhow!("Failed to cache embedding for tool {}: {e:?}", tool.name))?;

    Ok(())
}
