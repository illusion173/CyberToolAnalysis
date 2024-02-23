import React from "react";
import "./ShowToolData.css";
import { sendApproval, sendDenial } from "./UploadToolAPI.js";
function ShowToolData({ tool_data }) {
  function formatString(value) {
    return typeof value === "string" ? value.replace(/_/g, " ") : value;
  }

  function formatBoolean(value) {
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
    return value;
  }

  // New function to handle array formatting
  function formatArray(array) {
    return array.map((item) => formatString(formatBoolean(item))).join(", ");
  }

  const handleApproveToolClick = (tool_id, tool_function) => {
    let response = sendApproval(tool_id, tool_function);
    //window.location.reload();
  };

  const handleDenyToolClick = (tool_id, tool_function) => {
    let response = sendDenial(tool_id, tool_function);
    //window.location.reload();
  };
  // Extract Tool Name and Company, Description for specific styling
  const {
    Description,
    Approved,
    Tool_Name,
    Company,
    Tool_URL,
    ...restToolData
  } = tool_data;
  return (
    <div>
      {/* Displaying the Tool Name and Company as title and subtitle */}
      <div className="tool-title">
        <a href={Tool_URL} target="_blank" rel="noopener noreferrer">
          {formatString(Tool_Name)}
        </a>
      </div>
      <div className="tool-subtitle">{formatString(Company)}</div>
      <div className="tool-data">
        {Object.entries(restToolData).map(([key, value]) =>
          Array.isArray(value) ? (
            <div key={key}>
              <strong>{formatString(key)}:</strong> {formatArray(value)}
            </div>
          ) : (
            <div key={key}>
              <strong>{formatString(key)}:</strong>{" "}
              {formatString(formatBoolean(value).toString())}
            </div>
          ),
        )}
        <div>
          <strong>Tool Description</strong>
        </div>
        <div className="tool-description">{Description}</div>
      </div>
    </div>
  );
}

export default ShowToolData;
