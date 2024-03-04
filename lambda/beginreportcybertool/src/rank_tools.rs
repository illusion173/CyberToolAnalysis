//! Rank tools based on the how much the user's survey result matches each tool in the database.

use anyhow::Result;
use aws_sdk_dynamodb::Client as DynamoClient;
use std::cmp::Ordering;

use crate::db_wrapper;
use crate::{embedding::get_embeddings, types::*};

/// Ranks `tools` against `request`, and returns a list of tool + score in descending order of score
pub async fn get_tool_rankings(
    db_client: &DynamoClient,
    request: &RecommendationRequest,
    mut tools: Vec<ToolRow>,
) -> Result<Vec<(ToolRow, f32)>> {
    // Hide non-approved tools
    tools.retain(|i| i.approved.unwrap_or(true));

    // scores start at 0 by default
    let mut scores: Vec<_> = tools.into_iter().map(|t| (t, 0.0)).collect();

    // weights for each individual heuristic
    // modify these to change how much each heuristic effects the final score
    let cloud_capable_weight = 1.0;
    let aviation_weight = 1.0;
    let llm_embedding_description_weight = 3.0;

    // perform cloud heuristic
    for (t, score) in &mut scores {
        let heuristic = match t.cloud_capable {
            Some(true) => match request.responses.cloud_reliance {
                // if the tool is cloud capable, then the more cloud reliance you have, the better
                CloudReliance::Heavily => 1.0,
                CloudReliance::Partially => 0.5,
                CloudReliance::Minimal => 0.25,
                CloudReliance::None => 0.0,
            },
            Some(false) => match request.responses.cloud_reliance {
                // if you are not cloud capable, only increase score if the tool doesn't require cloud
                CloudReliance::None => 0.5,
                _ => 0.0,
            },
            None => 0.0,
        };

        *score += cloud_capable_weight * heuristic;
    }

    // perform aviation specific heuristic
    for (t, score) in &mut scores {
        if let Some(true) = t.aviation_apecific {
            if let Industry::AviationFocusedTools = request.responses.industry {
                let heuristic = 1.0;
                *score += aviation_weight * heuristic;
            }
        }
    }

    // perform llm embedding similarity heuristic based on free response from user and tool descriptions
    if !request.responses.free_response.is_empty() {
        let frq_embedding = &get_embeddings(vec![&request.responses.free_response])?[0];

        for (t, score) in &mut scores {
            if let Some(tool_desc) = &t.description {
                let (needs_update, tool_desc_embedding) = match &t.cached_sentence_embedding.0 {
                    Some(e) => (false, e.clone()),
                    None => (true, get_embeddings(vec![&tool_desc])?.remove(0)),
                };

                // The closer the tool embedding is with the user request's embedding, the more
                // this tool matches what they want
                let vector_similarity =
                    acap::cos::cosine_distance(frq_embedding.clone(), tool_desc_embedding.clone());

                *score += llm_embedding_description_weight * vector_similarity;

                // update cached embedding if we didn't already have one for this tool
                if needs_update {
                    db_wrapper::update_embedding(db_client, t.clone(), tool_desc_embedding).await?;
                }
            }
        }
    }

    // Rank by score, descending
    scores.sort_unstable_by(|(_, score1), (_, score2)| {
        (*score2).partial_cmp(score1).unwrap_or(Ordering::Equal)
    });

    Ok(scores)
}
