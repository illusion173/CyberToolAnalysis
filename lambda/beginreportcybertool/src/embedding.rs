//! Utility for transforming text to its embedding vectors using the MiniLM-L6-v2 model.
//!
//! See [`get_embeddings`].

use std::path::PathBuf;

use candle_transformers::models::bert::{BertModel, Config, DTYPE};

use anyhow::{anyhow, Result};
use candle_core::{Device, Tensor};
use candle_nn::VarBuilder;
use hf_hub::{api::sync::ApiBuilder, Repo, RepoType};
use tokenizers::{PaddingParams, Tokenizer};

/// Returns the embeddings of the given input batch in 384 dimensional space
pub fn get_embeddings(input: Vec<&str>) -> Result<Vec<Vec<f32>>> {
    let (model, mut tokenizer) = build_model_and_tokenizer()?;
    let device = &model.device;
    let pp = PaddingParams {
        strategy: tokenizers::PaddingStrategy::Fixed(128),
        ..Default::default()
    };
    tokenizer.with_padding(Some(pp));
    let tokens = tokenizer
        .encode_batch(input, true)
        .map_err(|e| anyhow!("Failed to encode input into tensor: {e:?}"))?;

    let mut token_ids = Vec::with_capacity(tokens.len());
    for encoding in tokens {
        token_ids.push(encoding.get_ids().to_vec());
    }
    let token_ids = Tensor::new(token_ids, device).map_err(|e| anyhow!("{e:?}"))?;
    let token_type_ids = token_ids.zeros_like().map_err(|e| anyhow!("{e:?}"))?;

    println!("running inference on batch {:?}", token_ids.shape());
    let start = std::time::Instant::now();
    let embeddings = model
        .forward(&token_ids, &token_type_ids)
        .map_err(|e| anyhow!("{e:?}"))?;

    println!("model forward timing {:?}", start.elapsed());
    let start = std::time::Instant::now();
    let (_n_sentence, n_tokens, _hidden_size) = embeddings.dims3().map_err(|e| anyhow!("{e:?}"))?;
    let embeddings = (embeddings.sum(1)? / (n_tokens as f64)).map_err(|e| anyhow!("{e:?}"))?;
    let embeddings =
        normalize_l2(&embeddings).map_err(|e| anyhow!("Failed to normalize embeddings: {e:?}"))?;

    println!(
        "pooled embeddings {:?} in {:?}",
        embeddings.shape(),
        start.elapsed()
    );
    let start = std::time::Instant::now();
    embeddings.to_device(&Device::Cpu)?;
    println!(
        "moved embedding tensor back to cpu in {:?}",
        start.elapsed()
    );

    embeddings.to_vec2::<f32>().map_err(|e| anyhow!("{e:?}"))
}

fn build_model_and_tokenizer() -> Result<(BertModel, Tokenizer)> {
    let device = candle_core::Device::cuda_if_available(0)
        .map_err(|e| anyhow!("Failed to create candle Device{e:?}"))?;

    let repo = Repo::with_revision(
        "sentence-transformers/all-MiniLM-L6-v2".to_string(),
        RepoType::Model,
        "refs/pr/21".to_string(),
    );
    let (config_filename, tokenizer_filename, weights_filename) = {
        let api = ApiBuilder::new()
            // aws lambda ephemeral storage needs to be enabled to use /tmp
            .with_cache_dir(PathBuf::from("/tmp"))
            .build()
            .map_err(|e| anyhow!("Failed to create hf cache: {e:?}"))?
            .repo(repo);

        let config = api
            .get("config.json")
            .map_err(|e| anyhow!("Failed to get model config: {e:?}"))?;

        let tokenizer = api
            .get("tokenizer.json")
            .map_err(|e| anyhow!("Failed to get tokenizer config{e:?}"))?;

        let weights = api
            .get("model.safetensors")
            .map_err(|e| anyhow!("Failed to get model safetensors{e:?}"))?;

        (config, tokenizer, weights)
    };
    let config = std::fs::read_to_string(config_filename)?;
    let config: Config = serde_json::from_str(&config)?;
    let tokenizer = Tokenizer::from_file(tokenizer_filename)
        .map_err(|e| anyhow!("Failed to read from tokenizer file{e:?}"))?;
    let vb = unsafe { VarBuilder::from_mmaped_safetensors(&[weights_filename], DTYPE, &device)? };
    let model =
        BertModel::load(vb, &config).map_err(|e| anyhow!("Failed to load bert model: {e:?}"))?;
    Ok((model, tokenizer))
}

fn normalize_l2(v: &Tensor) -> Result<Tensor> {
    Ok(v.broadcast_div(&v.sqr()?.sum_keepdim(1)?.sqrt()?)?)
}
