import { fetchJwt, getUserId } from "./helperFunctionsForUserAPI.js";
import { API } from "aws-amplify";

export const getFileNameFromUser = async () => {
  // Display a prompt window asking for a filename
  const fileName = window.prompt(
    "Enter a file name for report:",
    "(NotGivenFileName)",
  );

  // Handle the user input (you can perform further actions here)
  if (fileName) {
    alert(`You entered: ${fileName}`);
  } else {
    alert("No filename entered, using default.");
    return "default";
  }

  return fileName;
};

export const createReportForUser = async (
  questionnaire_responses,
  filename,
) => {
  console.log(questionnaire_responses);
  const jwt = await fetchJwt();
  const username = await getUserId();
  try {
    const apiName = "apic25cd3ea";
    const path = "/beginReportCyberTool";
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };

    const requestBody = {
      file_name: `${filename}`,
      user_identifier: `${username}`,
      responses: questionnaire_responses,
    };
    const myInit = {
      headers,
      body: requestBody,
    };

    let status = await API.post(apiName, path, myInit);
    return status;
  } catch (error) {
    alert(
      "Error while submitting request for report creation. Try again later.",
    );
  }
};
