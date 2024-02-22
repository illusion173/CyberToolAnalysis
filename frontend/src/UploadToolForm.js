import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // Importing the uuid function
import { submitPotentialTool } from "./UploadToolAPI.js";
import "./uploadtool.css";

function UploadToolForm() {
  const navigate = useNavigate();

  // Initialize state for each field in the JSON object
  const [toolFunction, setToolFunction] = useState("");
  const [toolID, setToolID] = useState(uuidv4()); // Automatically set toolID as a UUID
  const [aiMlUse, setAiMlUse] = useState(false);
  const [aviationSpecific, setAviationSpecific] = useState(false);
  const [company, setCompany] = useState("");
  const [customers, setCustomers] = useState([]);
  const [maturityLevel, setMaturityLevel] = useState("");
  const [toolBox, setToolBox] = useState(false);
  const [toolName, setToolName] = useState("");
  const [description, setDescription] = useState("");

  // Handle input changes for 'Customers' as a comma-separated string
  const handleCustomersChange = (event) => {
    const customerArray = event.target.value
      .split(",")
      .map((customer) => customer.trim());
    setCustomers(customerArray);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      Tool_Function: toolFunction,
      Tool_ID: toolID,
      "AI/ML_Use": aiMlUse,
      Aviation_Specific: aviationSpecific,
      Company: company,
      Customers: customers,
      Maturity_Level: parseInt(maturityLevel, 10),
      ToolBox: toolBox,
      Tool_Name: toolName,
    };

    submitPotentialTool(formData);

    console.log(formData); // For demonstration, replace with form submission logic
    // navigate("/some-path"); // Redirect on form submit, adjust path as needed
    //navigate("/uploadtool");
  };

  // Array of tool functions
  const toolFunctions = [
    { label: "Select Function", value: "" },
    { label: "Log Analysis", value: "Log_Analysis" },
  ];
  // Function to render the character count indicator
  const renderCharacterCount = () => {
    const remaining = 1000 - description.length;
    return `Characters left: ${remaining}`;
  };

  return (
    <div className="form-container">
      <h1>Upload Tool Form</h1>
      <button
        type="button"
        className="dashboard-button-tools"
        onClick={() => navigate("/uploadtool")}
      >
        Back
      </button>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-group-label">
            Tool Name
            <input
              type="text"
              value={toolName}
              onChange={(e) => setToolName(e.target.value)}
              placeholder="Tool Name"
            />
          </label>
        </div>
        <div className="form-group">
          <label className="form-group-label">
            Tool Function:
            <select
              value={toolFunction}
              onChange={(e) => setToolFunction(e.target.value)}
            >
              {toolFunctions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="form-group">
          {" "}
          <label className="form-group-label">
            AI/ML Use:
            <input
              type="checkbox"
              checked={aiMlUse}
              onChange={(e) => setAiMlUse(e.target.checked)}
            />
          </label>
        </div>
        <div className="form-group">
          {" "}
          <label className="form-group-label">
            Aviation Specific:
            <input
              type="checkbox"
              checked={aviationSpecific}
              onChange={(e) => setAviationSpecific(e.target.checked)}
            />
          </label>
        </div>
        <div className="form-group">
          {" "}
          <label className="form-group-label">
            ToolBox:
            <input
              type="checkbox"
              checked={toolBox}
              onChange={(e) => setToolBox(e.target.checked)}
            />
          </label>
        </div>
        <div className="form-group">
          {" "}
          <label className="form-group-label">
            Parent Company Name
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Company"
            />
          </label>
        </div>
        <div className="form-group">
          <label className="form-group-label">
            Customers{" "}
            <input
              type="text"
              value={customers.join(", ")}
              onChange={handleCustomersChange}
              placeholder="Customers (comma-separated)"
            />
          </label>
        </div>
        <div className="form-group">
          <label className="form-group-label">
            Maturity Level{" "}
            <input
              type="number"
              value={maturityLevel}
              onChange={(e) => setMaturityLevel(e.target.value)}
              min="0"
              max="3"
              placeholder="Maturity Level"
            />
          </label>
        </div>
        <div className="form-group">
          <label className="form-group-label">
            Description
            <div className="textarea-description">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter the tool description (max 1000 characters)"
                maxLength="1000" // Set maximum length
                rows="5" // Set initial visible rows
              ></textarea>
            </div>
          </label>
          <div className="character-count">{renderCharacterCount()}</div>
        </div>
        <button type="submit" className="dashboard-button-tools button-submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default UploadToolForm;
