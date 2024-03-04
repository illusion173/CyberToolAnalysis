#!/usr/bin/env bash
# Enable SSE features to speed up llm inference for embeddings
cargo c && RUSTFLAGS="-C target-feature=+sse2,+avx,+fma,+avx2" cargo lambda build --release && cargo lambda deploy -a LatestVersion beginreportcybertool
