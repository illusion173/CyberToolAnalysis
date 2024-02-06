#!/bin/bash

# Setup json args so amplify can run headlessly in ci

REACTCONFIG="{\
\"SourceDir\":\"src\",\
\"DistributionDir\":\"build\",\
\"BuildCommand\":\"npm run-script build\",\
\"StartCommand\":\"npm run-script start\"\
}"
AWSCLOUDFORMATIONCONFIG="{\
\"configLevel\":\"project\",\
\"useProfile\":false,\
\"profileName\":\"default\",\
\"accessKeyId\":\"$AWS_ACCESS_KEY_ID\",\
\"secretAccessKey\":\"$AWS_SECRET_ACCESS_KEY\",\
\"region\":\"$AWS_REGION\"\
}"
AMPLIFY="{\
\"projectName\":\"CyberToolWebsite\",\
\"appId\":\"d2czkb5va0rc18\",\
\"envName\":\"staging\",\
\"defaultEditor\":\"code\"\
}"
FRONTEND="{\
\"frontend\":\"javascript\",\
\"framework\":\"react\",\
\"config\":$REACTCONFIG\
}"
PROVIDERS="{\
\"awscloudformation\":$AWSCLOUDFORMATIONCONFIG\
}"

amplify pull --amplify $AMPLIFY --frontend $FRONTEND --providers $PROVIDERS --yes || true

# TODO(troy): remove ` amplify pull ... || true` hack above by checking output for expected DynamoDB failure string.
# This code is close to what I want, but doesn't work, I think because the newlines must be there between json objects,
# but getting this right while double deep in bash is hard.
#
# echo "Running amplify pull"
# # Grab raw exit code and output
# pull_output=$(bash -c "amplify pull --amplify $AMPLIFY --frontend $FRONTEND --providers $PROVIDERS --yes" 2>&1)
# pull_exit=$?
# 
# # Sometimes amplify pull fails with `The previously configured DynamoDB Table: 'undefined' cannot be found`,
# # if this the case pretend like we succeeded since we dont care about DynamoDB when checking if the frontend builds
# echo "$pull_output" | grep -q "The previously configured DynamoDB Table: 'undefined' cannot be found"
# output_ok=$?
# echo "output_ok" $output_ok
# echo "pull_output" $pull_output
# echo "pull_exit" $pull_exit
