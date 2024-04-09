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
  const [customFields, setCustomFields] = useState([
    { category: "", datatype: "", value: "" },
  ]);
  // Handle input changes for 'Customers' as a comma-separated string
  const handleCustomersChange = (event) => {
    const customerArray = event.target.value
      .split(",")
      .map((customer) => customer.trim());
    setCustomers(customerArray);
  };

  function abbreviatePrefix(str) {
    // Split the string by underscore, then map each word to its first character,
    // join these characters, and finally add an underscore at the end.
    return (
      str
        .split("_")
        .map((word) => word[0])
        .join("")
        .toUpperCase() + "_"
    );
  }
  const validateCustomFields = () => {
    for (let field of customFields) {
      // Validate boolean fields
      if (field.datatype === "boolean") {
        const valueLowered = field.value.toLowerCase();
        if (valueLowered !== "true" && valueLowered !== "false") {
          alert(
            `Error in '${field.category}': Please enter 'true' or 'false' for boolean values.`,
          );
          return false; // Invalid boolean value
        }
      }

      // Validate number fields
      if (field.datatype === "number") {
        // This regular expression checks if the value is an integer or a floating point number
        const numberRegex = /^-?\d+(\.\d+)?$/;
        if (!numberRegex.test(field.value)) {
          alert(
            `Error in '${field.category}': Please enter a valid number for number datatype.`,
          );
          return false; // Invalid number value
        }
      }

      // You can add more datatype validations here as needed
    }

    // If all validations pass
    return true;
  };

  const processCustomFields = () => {
    const customFieldsData = {};
    customFields.forEach((field) => {
      let fieldName = field.category
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join("_");

      let fieldValue = field.value;
      if (field.datatype === "boolean") {
        fieldValue = fieldValue.toLowerCase() === "true"; // Converts to boolean true/false
      } else if (field.datatype === "number") {
        fieldValue = Number(fieldValue); // Converts string to number
      }
      customFieldsData[fieldName] = fieldValue;
    });
    return customFieldsData;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // First validate the custom fields
    if (!validateCustomFields()) {
      return; // Stop the submission if validation fails
    }
    let prefix = abbreviatePrefix(toolFunction);
    let processedCustomFields = processCustomFields();
    console.log(processedCustomFields);

    const formData = {
      Tool_Function: toolFunction,
      Tool_ID: prefix + toolID,
      "AI/ML_Use": aiMlUse,
      Aviation_Specific: aviationSpecific,
      Company: company,
      Customers: customers,
      Maturity_Level: parseInt(maturityLevel, 10),
      ToolBox: toolBox,
      Tool_Name: toolName,
      Description: description,
      ...processedCustomFields,
    };

    submitPotentialTool(formData);
  };

  // Array of tool functions
  const toolFunctions = [
    { label: "Select Function", value: "" },
    {
      label: "Industrial Control Systems",
      value: "Industrial_Control_Systems",
    },
    {
      label: "Cybersecurity Service Provider",
      value: "Cybersecurity_Service_Provider",
    },
    { label: "Virtual Private Network", value: "Virtual_Private_Network" },
    { label: "Aircraft Log & Anomaly Detection Tools", value: "Log_Analysis" },
    {
      label: "Firewall and Network Security",
      value: "Firewall_Network_Security",
    },
    {
      label: "Secure Communication and Data Encryption",
      value: "Secure_Communication_Data_Encryption",
    },
    {
      label: "Access Control and Identity Management",
      value: "Access_Control_Identity_Management",
    },
    {
      label: "Security Information and Event Management (SIEM) Systems",
      value: "Security_Information_Event_Management_Systems",
    },
    { label: "Vulnerability Management", value: "Vulnerability_Management" },
    {
      label: "Threat Intelligence Platforms",
      value: "Threat_Intelligence_Platforms",
    },
    {
      label: "Supply Chain Risk Management Solution",
      value: "Supply_Chain_Risk_Management_Solution",
    },
    {
      label: "Regulatory Compliance Tools",
      value: "Regulatory_Compliance_Tools",
    },
    { label: "Aviation Focused Tools", value: "Aviation_Focused_Tools" },
    { label: "General Tools", value: "General_Tools" },
    { label: "Endpoint Security", value: "Endpoint_Security" },
  ];
  // Function to render the character count indicator
  const renderCharacterCount = () => {
    const remaining = 1000 - description.length;
    return `Characters left: ${remaining}`;
  };

  const handleCustomFieldChange = (index, event) => {
    const values = [...customFields];
    values[index][event.target.name] = event.target.value;
    setCustomFields(values);
  };

  const addCustomField = () => {
    setCustomFields([
      ...customFields,
      { category: "", datatype: "", value: "" },
    ]);
  };

  const removeCustomField = (index) => {
    const values = [...customFields];
    values.splice(index, 1);
    setCustomFields(values);
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
        <div className="form-group">
          {customFields.map((customField, index) => (
            <div key={index} className="custom-field-group">
              <input
                name="category"
                value={customField.category}
                onChange={(e) => handleCustomFieldChange(index, e)}
                placeholder="Category"
              />
              <select
                name="datatype"
                value={customField.datatype}
                onChange={(e) => handleCustomFieldChange(index, e)}
              >
                <option value="">Select Data Type</option>
                <option value="string">String Limit 1000 Characters</option>
                <option value="number">Number Signed Int</option>
                <option value="boolean">Boolean</option>
                {/* Add other datatypes as needed */}
              </select>
              <div>
                <input
                  name="value"
                  value={customField.value}
                  onChange={(e) => handleCustomFieldChange(index, e)}
                  placeholder="Value"
                />
              </div>
              <b></b>
              <button type="button" onClick={() => removeCustomField(index)}>
                Remove Category
              </button>
              <div style={{ marginTop: "20px" }}></div>
            </div>
          ))}
          <button type="button" onClick={addCustomField}>
            Add Custom Field
          </button>
        </div>

        <button type="submit" className="dashboard-button-tools button-submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default UploadToolForm;
