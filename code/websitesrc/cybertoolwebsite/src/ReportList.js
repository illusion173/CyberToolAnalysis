import "./ReportList.css";
import React, { useState, useEffect } from "react";
import { API, Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";

const ReportList = () => {
  const navigate = useNavigate();

  const [reportListArray, setReportListArray] = useState([]);

  const handleDashboardClick = async () => {
    navigate("/Dashboard");
  };

  const fetchReportList = async () => {
    try {
      const apiName = "apifdfc7a6f";

      const path = "/getReportList";

      const myInit = {
        headers: {
          Authorization: `Bearer ${(await Auth.currentSession())
            .getIdToken()
            .getJwtToken()}`,
        },
      };

      //report_array = await API.get(apiName, path, myInit);
      //setReportListArray(report_array);
    } catch (error) {
      alert("Unable to retrieve report list");
    }
  };

  const fetchPreSignedUrl = async (report_id) => {
    try {
      const apiName = "apifdfc7a6f";

      const path = "/requestpresignedurl";

      const myInit = {
        headers: {
          Authorization: `Bearer ${(await Auth.currentSession())
            .getIdToken()
            .getJwtToken()}`,
          report_id: report_id,
        },
      };

      //presigned_url_data = await API.get(apiName, path, myInit);
      //console.log(presigned_url_data);
      //return presigned_url_data;
    } catch (error) {
      alert("Unable to retrieve presigned url");
    }
  };

  return (
    <div>
      <div></div>
      <h1>Report Dashboard</h1>
      <button onClick={handleDashboardClick}>Dashboard</button>

      <button onClick={fetchReportList}>Refresh</button>
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
