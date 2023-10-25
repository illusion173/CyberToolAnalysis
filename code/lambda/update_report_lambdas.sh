#!/bin/bash
#
#
#
cd /home/illusion/CS490Project/CyberToolAnalysis/code/lambda/reportcybertool
cargo build --release
cargo lambda deploy

cd /home/illusion/CS490Project/CyberToolAnalysis/code/lambda/reportcreatepresignedurl
cargo build --release
cargo lambda deploy

cd /home/illusion/CS490Project/CyberToolAnalysis/code/lambda/beginreportcybertool
cargo build --release
cargo lambda deploy
