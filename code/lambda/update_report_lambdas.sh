#!/bin/bash
#
#
#
cd /home/illusion/CS490Project/CyberToolAnalysis/code/lambda/reportcybertool
cargo lambda build --release
cargo lambda deploy -a LatestVersion

cd /home/illusion/CS490Project/CyberToolAnalysis/code/lambda/reportcreatepresignedurl
cargo lambda build --release
cargo lambda deploy -a LatestVersion

cd /home/illusion/CS490Project/CyberToolAnalysis/code/lambda/beginreportcybertool
cargo lambda build --release
cargo lambda deploy -a LatestVersion

cd /home/illusion/CS490Project/CyberToolAnalysis/code/lambda/getreportlist
cargo lambda build --release
cargo lambda deploy -a LatestVersion
