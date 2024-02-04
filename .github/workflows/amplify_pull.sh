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
\"appId\":\"dqijt2r7sg70n\",\
\"envName\":\"main\",\
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
