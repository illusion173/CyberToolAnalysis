import { fetchJwt, getUserId } from "./helperFunctionsForUserAPI.js";
import { API } from "aws-amplify";

export async function fetchPreSignedUrl(report_id, file_name) {
  const jwt = await fetchJwt();
  try {
    const apiName = "apic25cd3ea";
    const path = "/requestpresignedurl";

    const headers = {
      Authorization: `Bearer ${jwt}`,
    };

    const requestBody = {
      report_id: report_id,
    };

    const myInit = {
      headers,
      body: requestBody,
    };

    let presigned_url_data = await API.post(apiName, path, myInit);
    var link = document.createElement("a");
    link.href = presigned_url_data;
    link.download = `${file_name}.pdf`; // Set the filename with the .pdf extension
    link.click();
  } catch (error) {
    alert("Unable to retrieve presigned url");
  }
}

export async function fetchReportList() {
  const jwt = await fetchJwt();
  const username = await getUserId();
  try {
    const apiName = "apic25cd3ea";

    const path = "/getReportListForUser";

    const headers = {
      Authorization: `Bearer ${jwt}`,
    };

    const requestBody = {
      user_identifier: `${username}`,
    };

    const myInit = {
      headers,
      body: requestBody,
    };

    let report_array = await API.post(apiName, path, myInit);
    return report_array;
  } catch (error) {
    alert("Unable to retrieve report list");
    return [];
  }
}
