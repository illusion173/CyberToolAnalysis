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
      const apiName = "apib5cf8c70";
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
      console.log(report_array);
      //setReportListArray(report_array);
    } catch (error) {
      alert("Unable to retrieve report list");
    }
  };

  const fetchPreSignedUrl = async (report_id) => {
    const jwt = await fetchJwt();
    try {
      const apiName = "apib5cf8c70";
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

      let presigned_url_data = await API.get(apiName, path, myInit);
      console.log(presigned_url_data);
      //return presigned_url_data;
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
      <table className="styled-table">
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
                <button onClick={() => fetchPreSignedUrl(report.report_id)}>
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