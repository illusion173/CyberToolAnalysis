import "./ReportList.css";
import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import { fetchJwt, getUserId } from "./helperFunctionsForUserAPI.js";
const ReportList = () => {
  useEffect(() => {
    fetchReportList();
  }, []);
  const navigate = useNavigate();

  const [reportListArray, setReportListArray] = useState([]);

  const handleDashboardClick = async () => {
    navigate("/Dashboard");
  };

  const fetchReportList = async () => {
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
      setReportListArray(report_array);
      //setReportListArray(report_array);
    } catch (error) {
      alert("Unable to retrieve report list");
    }
  };

  const fetchPreSignedUrl = async (report_id, file_name) => {
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
  };

  return (
    <div>
      <div></div>
      <h1>Report Menu</h1>
      <button onClick={handleDashboardClick} className="report-button-tools">
        Dashboard
      </button>

      <button onClick={fetchReportList} className="report-button-tools">
        Refresh
      </button>
      <table className="report-styled-table">
        <thead>
          <tr>
            <th>File Name</th>
            <th>Date Created</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {reportListArray.map((report, index) => (
            <tr key={index}>
              <td>{report.file_name}</td>
              <td>{new Date(report.date_made).toLocaleDateString()}</td>
              <td>
                <button
                  onClick={() =>
                    fetchPreSignedUrl(report.report_id, report.file_name)
                  }
                >
                  Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default ReportList;
