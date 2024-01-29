#!/bin/bash
#
#
#
cd /home/illusion/Desktop/school/CyberToolAnalysis/code/lambda/reportcybertool
cargo lambda build --release
cargo lambda deploy -a LatestVersion

cd /home/illusion/Desktop/school/CyberToolAnalysis/code/lambda/reportcreatepresignedurl
cargo lambda build --release
cargo lambda deploy -a LatestVersion

cd /home/illusion/Desktop/school/CyberToolAnalysis/code/lambda/beginreportcybertool
cargo lambda build --release
cargo lambda deploy -a LatestVersion

cd /home/illusion/Desktop/school/CyberToolAnalysis/code/lambda/getreportlist
cargo lambda build --release
cargo lambda deploy -a LatestVersion

cd /home/illusion/Desktop/school/CyberToolAnalysis/code/lambda/getAllTools
cargo lambda build --release
cargo lambda deploy -a LatestVersion

cd /home/illusion/Desktop/school/CyberToolAnalysis/code/lambda/getsingulartooldata
cargo lambda build --release
cargo lambda deploy -a LatestVersion
