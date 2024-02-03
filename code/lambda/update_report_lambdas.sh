#!/usr/bin/env bash
#

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
pushd $SCRIPT_DIR

pushd ./reportcybertool
cargo lambda build --release
cargo lambda deploy -a LatestVersion
popd

pushd ./reportcreatepresignedurl
cargo lambda build --release
cargo lambda deploy -a LatestVersion
popd

pushd ./beginreportcybertool
cargo lambda build --release
cargo lambda deploy -a LatestVersion
popd

pushd ./getreportlist
cargo lambda build --release
cargo lambda deploy -a LatestVersion
popd

pushd ./getAllTools
cargo lambda build --release
cargo lambda deploy -a LatestVersion
popd

pushd ./getsingulartooldata
cargo lambda build --release
cargo lambda deploy -a LatestVersion
popd

popd
