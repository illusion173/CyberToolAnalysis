import "./ReportList.css";
import { fetchReportList, fetchPreSignedUrl } from "./reportAPI.js";
import React, { useState, useEffect } from "react";

function ReportTable() {
  const [reportListArray, setReportListArray] = useState([]);

  useEffect(() => {
    refreshClick();
  }, []);

  const refreshClick = async (e) => {
    let report_list = await fetchReportList();
    setReportListArray(report_list);
  };

  return (
    <div>
      <button onClick={() => refreshClick()} className="report-button-tools">
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
}

export default ReportTable;
