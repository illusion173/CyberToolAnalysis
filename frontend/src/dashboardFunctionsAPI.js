import { fetchJwt } from "./helperFunctionsForUserAPI.js";
import { API } from "aws-amplify";
// Main handler for all API requests to obtain tool data.
function formatString(value) {
  return typeof value === "string" ? value.replace(/_/g, " ") : value;
}

export async function fetchToolDashboardList(filterInput, lastEvaluatedKey) {
  const jwt = await fetchJwt();
  try {
    const apiName = "apic25cd3ea";
    const path = "/fetchDashboard";
    filterInput["Approved"] = true;

    const headers = {
      Authorization: `Bearer ${jwt}`,
    };

    const requestBody = {
      filter_input: filterInput,
      last_evaluated_key: lastEvaluatedKey,
    };

    const myInit = {
      headers,
      body: requestBody,
    };

    let response = await API.post(apiName, path, myInit);
    // Process and format response data before setting state
    const formattedData = response["tool_list"].map((tool) => ({
      ...tool,
      Tool_Name: formatString(tool.Tool_Name),
      Tool_Function: formatString(tool.Tool_Function),
      Company: formatString(tool.Company),
      // Apply formatString to other fields if necessary
    }));

    return [formattedData, response["last_evaluated_key"]];
  } catch (error) {
    console.log(error);
    alert("Unable to retrieve tool list");
  }
}

export async function fetchSingularToolData(tool_id, tool_function) {
  const jwt = await fetchJwt();
  let converted_tool_function = tool_function.replace(/\s/g, "_");
  try {
    const apiName = "apic25cd3ea";
    const path = "/getSingularToolData";

    const headers = {
      Authorization: `Bearer ${jwt}`,
    };

    const requestBody = {
      tool_function: `${converted_tool_function}`,
      tool_id: `${tool_id}`,
    };

    const myInit = {
      headers,
      body: requestBody,
    };

    let response = await API.post(apiName, path, myInit);
    delete response.Cached_Sentence_Embedding;
    return response;
  } catch (error) {
    console.log(error);
    //alert("Unable to retrieve tool data for " + tool_id);
  }
}
