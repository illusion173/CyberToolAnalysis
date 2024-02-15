import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./Dashboard.css";
function UploadTool() {
  const navigate = useNavigate();

  useEffect(() => { }, []);

  // NAVIGATION TO DIFFERENT PAGES
  const handleQuestionnaireClick = (e) => {
    navigate("/Questionnaire");
  };

  const handleReportListClick = (e) => {
    navigate("/ReportList");
  };

  const handleAccountInfo = (e) => {
    navigate("/Account");
  };

  return (
    <div className="App">
      <p className="dashboard-welcome">Upload Tool Menu</p>
      <span>
        <button
          className="dashboard-button-tools"
          onClick={handleReportListClick}
        >
          Report Menu
        </button>
        <button
          className="dashboard-button-tools"
          onClick={handleQuestionnaireClick}
        >
          Questionnaire
        </button>
      </span>
      <div>
        <button className="dashboard-button-tools" onClick={handleAccountInfo}>
          Account Information
        </button>
      </div>
    </div>
  );
}

export default UploadTool;
