import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { fetchToolDashboardList } from "./dashboardFunctionsAPI.js";

function ToolTable() {
  // Pagination state and handlers
  const [currentPage, setCurrentPage] = useState(1);
  const [toolData, setToolData] = useState([]);
  const [loadCount, setLoadCount] = useState(0);
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState({});
  const [filterInput, setFilterInput] = useState({});
  const [itemsToDisplay, setItemstoDisplay] = useState([]);
  const [toolFunctionSelections, setToolFunctionSelections] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const itemsPerPage = 10;

  useEffect(() => {
    alert(JSON.stringify(filterInput));
  }, [filterInput]);

  useEffect(() => {
    setFilterInput((prev) => ({
      ...prev,
      Tool_Functions: toolFunctionSelections,
    })); //updates every time the toolFunctionSelections state changes
  }, [toolFunctionSelections]);

  // updates process for the tool_functions key based on what the user chose
  useEffect(() => {
    // THe appropriate dictionary for Tool Function dropdown
    const tool_function_categories_cleaner_dict = {
      "Industrial Control Systems": "Industrial_Control_Systems",
      "Cybersecurity Service Provider": "Cybersecurity_Service_Provider",
      "Virtual Private Network": "Virtual_Private_Network",
      "Aircraft Log & Anomaly Detection Tools": "Log_Analysis",
      "Firewall and Network Security": "Firewall_Network_Security",
      "Secure Communication and Data Encryption":
        "Secure_Communication_Data_Encryption",
      "Access Control and Identity Management":
        "Access_Control_Identity_Management",
      "Security Information and Event Management (SIEM) Systems":
        "Security_Information_Event_Management_Systems",
      "Vulnerability Management": "Vulnerability_Management",
      "Threat Intelligence Platforms": "Threat_Intelligence_Platforms",
      "Supply Chain Risk Management Solution":
        "Supply_Chain_Risk_Management_Solution",
      "Regulatory Compliance Tools": "Regulatory_Compliance_Tools",
      "Aviation Focused Tools": "Aviation_Focused_Tools",
      "General Tools": "General_Tools",
      "Endpoint Security": "Endpoint_Security",
    };

    if (toolFunctionSelections.length > 0) {
      // If there are selected tool functions, add/replace the tool_functions key in filterInput
      const updatedToolFunctions = toolFunctionSelections.map((tf) =>
        tf.replace(/\s+/g, "_"),
      ); // Use underscore for JSON
      setFilterInput((prevFilterInput) => ({
        ...prevFilterInput,
        Tool_Functions: updatedToolFunctions,
      }));
    } else {
      // If there are no selections, take off the tool_functions key from filterInput
      const { Tool_Functions, ...restFilterInput } = filterInput;
      setFilterInput(restFilterInput);
    }
  }, [toolFunctionSelections]);

  useEffect(() => {
    // Define the function within the useEffect to ensure it captures the current state
    const fetchData = async () => {
      let response = await fetchToolDashboardList(
        filterInput,
        lastEvaluatedKey,
      );
      setToolData(response[0]);
      setLastEvaluatedKey(response[1]);
    };

    if (loadCount === 0) {
      fetchData();
      setLoadCount(1);
    } else {
      ItemstoDisplay();
    }
  }, [toolData]);

  const wipeCache = () => {
    setFilterInput([]);
    setLastEvaluatedKey({});
    setToolData([]);
    setCurrentPage(1);
    setItemstoDisplay([]);
  };

  const handleCompanyChange = (event) => {
    const companyName = event.target.value; //Gets user's company choice

    //Checks if a company name was selected
    setFilterInput((prev) => {
      // If the compant name is not an empty string, it replaces spaces with underscores for JSON
      if (companyName.trim() !== "") {
        const companyNameForJson = companyName.replace(/\s+/g, "_");
        return { ...prev, Company: companyNameForJson };
      } else {
        // If the company name is empty, remove the company key from the filterInput state
        const { Company, ...rest } = prev; //Destructures filterInput state to exlude the company key and keeps the rest so no keys are in JSON
        return rest;
      }
    });

    // Update the selected company state
    setSelectedCompany(companyName);
  };

  const handleToolFunction = (e) => {
    const { value, checked } = e.target; //Value is the tool, checked is the boolean
    const adjustedValue = value.replace(/\s+/g, "_");

    setToolFunctionSelections((prevSelections) => {
      const newSelections = new Set(prevSelections); // Set is for no duplicates
      if (checked) {
        newSelections.add(adjustedValue); //Underscored tool function is added to set
      } else {
        newSelections.delete(adjustedValue); //Underscored tool is removed for deselecting tool
      }
      return [...newSelections]; // Converted back to array
    });
  };

  // All the options
  const filterOptions = [
    "Aviation Specific",
    "ToolBox",
    "Maturity Level 1",
    "Maturity Level 2",
    "Maturity Level 3",
    "Maturity Level 4",
    "AI/ML Use",
  ];
  const filterOptionsForToolFunction = [
    "Aircraft Log & Anamaly Detection Tools",
    "Firewall and Network Security",
    "Endpoint Security",
    "Secure Communication and Data Encryption",
    "Access Control and Identity Management",
    "Security Information and Event Management (SIEM) Systems",
    "Vulnerability Management",
    "Threat Intelligence Platforms",
    "Supply Chain Risk Management Solution",
    "Regulatory Compliance Tools",
    "Aviation Focused Tools",
    "General Tools",
    "Industrial Control Systems Cyber Tools",
  ];
  const filterOptionsForCompany = [
    "Airbus",
    "Jepperson",
    "Cisco",
    "Fortinet",
    "Check Point",
    "SonicWall",
    "Sophos",
    "WatchGuard",
    "Palo Alto",
    "McAfee",
    "Darktrace",
    "Vectra",
    "VMWare",
    "Cylance",
    "Sophos",
    "Bitdefender",
    "Fidelis",
    "SentinelOne",
    "Tanium",
    "CrowdStrike",
    "Cisco",
    "Okta",
    "Microsoft",
    "Ping",
    "Splunk",
    "IBM",
    "Tenable",
    "Rapid7",
    "ThreatConnect",
    "Mandiant",
    "Anomali",
    "Recorded Future",
    "MasterCard",
    "Tripwire",
    "SolarWinds",
    "CyberArk",
    "Fireye",
    "Palo Alto Networks",
    "WithSecure",
    "Trendo Micro",
    "Claroty",
    "Nozomi Networks",
    "Dragos",
    "ForeScout Technologies",
    "Boeing",
    "AT&T",
    "CISCO",
    "Vectra",
    "United Technologies",
  ];

  // Handles changes to maturity level checkboxes and updates the filter state.
  const handleMaturityLevel = (e) => {
    const { value, checked } = e.target;

    // Skip processing for inputs not related to maturity levels.
    if (!value.startsWith("Maturity Level")) {
      setFilterInput((prev) => ({ ...prev, [value]: checked }));
      return;
    }

    // Extract the numerical maturity level from the checkbox value.
    const level = parseInt(value.split(" ")[2], 10);

    // Update the filter input state with the new set of maturity levels.
    setFilterInput((prev) => {
      const currentLevels = prev.Maturity_Level;
      const updatedLevels = computeMaturityLevels(
        currentLevels,
        level,
        checked,
      );
      return adjustMaturityLevelState(prev, updatedLevels);
    });
  };

  // Computes the updated list of maturity levels based on the user's action.
  const computeMaturityLevels = (currentLevels, newLevel, isChecked) => {
    let levels = Array.isArray(currentLevels)
      ? currentLevels
      : [currentLevels].filter(Boolean);

    if (isChecked) {
      // Add the new level if the checkbox is checked.
      levels.push(newLevel);
    } else {
      // Remove the level if the checkbox is unchecked.
      levels = levels.filter((level) => level !== newLevel);
    }

    // Ensure the levels list contains unique values and is sorted.
    return Array.from(new Set(levels)).sort((a, b) => a - b);
  };

  // Updates the filter input state specifically for maturity levels.
  const adjustMaturityLevelState = (prevState, updatedLevels) => {
    if (updatedLevels.length === 0) {
      // Remove the maturity level key if no levels are selected.
      const { Maturity_Level, ...rest } = prevState;
      return rest;
    } else if (updatedLevels.length === 1) {
      // Store as a single integer if only one level is selected.
      return { ...prevState, Maturity_Level: updatedLevels[0] };
    }
    // Store as an array if multiple levels are selected.
    return { ...prevState, Maturity_Level: updatedLevels };
  };

  const handleRefreshClick = async () => {
    // We set the user to the beginninng of whatever they queried.
    let response = await fetchToolDashboardList(filterInput, {});
    setToolData(response[0]);
    setLastEvaluatedKey(response[1]);
    ItemstoDisplay();
  };

  const ItemstoDisplay = (e) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const listOfItemsToDisplay = toolData.slice(startIndex, endIndex - 1);
    setItemstoDisplay(listOfItemsToDisplay);
  };

  const grabNextData = async () => {
    // Grab the next page of data for user.
    let response = await fetchToolDashboardList(filterInput, lastEvaluatedKey);
    let tool_list = response[0] || {};
    setToolData((currentArr) => [...currentArr, tool_list]);
    let lek = response[1] || {};
    setLastEvaluatedKey(lek);
    ItemstoDisplay();
  };

  // On update of filter
  const updateFilterRequery = async (filter_from_frontend) => {
    wipeCache();
    setFilterInput(filter_from_frontend);
    // We set the user to the beginninng of whatever they queried.
    let response = await fetchToolDashboardList(filterInput, {});
    let tool_list = response[0] || {};
    let lek = response[1] || {};
    setToolData(tool_list);
    setLastEvaluatedKey(lek);
    ItemstoDisplay();
  };

  const handleFilterChange = (e) => {
    wipeCache();
    setFilterInput(e.target.value);
  };

  const handleNextPageClick = (e) => {
    if (lastEvaluatedKey === null) {
      alert("No more tools to retrieve.");
      return;
    }
    const currentPageIndex = (currentPage - 1) * itemsPerPage;

    // ex page 1 -> page 2
    //
    // current page index would be 0

    //Default length would be 10, so 10 <= 0 + 10, true && last_evaluated_key will always be true on default load.
    // In this case, we increase page num, and requery for 10 new tools and reupdate what we show.
    // Check if we're at the end of the current items and if there's a next page key available
    if (
      toolData.length <= currentPageIndex + itemsPerPage &&
      Object.keys(lastEvaluatedKey).length !== 0
    ) {
      setCurrentPage(currentPage + 1);
      grabNextData();
    }

    // Update currentPage only if there are more items to display
    // This can be adjusted based on how you want to handle the UI when no more items are available
    if (
      toolData.length > currentPageIndex + itemsPerPage ||
      Object.keys(lastEvaluatedKey).length === 0
    ) {
      setCurrentPage(currentPage + 1);
      setItemstoDisplay();
    } else {
      // Optionally, handle the scenario when no more data is available
      alert("No more items to display/get.");
    }
  };

  const handleRowClick = (tool_id) => {
    //NAVIGATE TO SINGULAR TOOL PAGE HERE!
    //fetchSingularToolData(tool_id);
  };

  const handlePreviousPageClick = (e) => {
    // Ensure currentPage does not go below 1
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }

    ItemstoDisplay();
  };

  const handleFilterSubmit = () => {
    updateFilterRequery(filterInput);
  };

  return (
    <div>
      {/* Move the Refresh button here, outside and above the .container div */}
      <button onClick={handleRefreshClick} className="dashboard-button-tools">
        Refresh
      </button>

      {/* Start of .container div */}
      <div className="container">
        <div>
          <div className="filter-section">
            <p className="dashboard-filter">Filter Options</p>
            {filterOptions.map((option, index) => {
              const isMaturityLevel = option.startsWith("Maturity Level");
              const level = isMaturityLevel
                ? parseInt(option.split(" ")[2], 10)
                : 0;

              return (
                <div key={index}>
                  <input
                    type="checkbox"
                    id={`checkbox-${index}`}
                    value={option}
                    onChange={handleMaturityLevel}
                    checked={
                      isMaturityLevel
                        ? Array.isArray(filterInput["Maturity_Level"])
                          ? filterInput["Maturity_Level"].includes(level)
                          : filterInput["Maturity_Level"] === level
                        : filterInput[option] || false
                    }
                  />
                  <label htmlFor={`checkbox-${index}`}>{option}</label>
                </div>
              );
            })}
          </div>

          <p className="dashboard-toolFunction">Tool Function</p>
          <div className="filter-selection">
            {filterOptionsForToolFunction.map((functionOption, index) => (
              <div key={index}>
                <input
                  type="checkbox"
                  id={`tool-function-${index}`}
                  value={functionOption.replace(/_/g, " ")}
                  onChange={handleToolFunction}
                  checked={toolFunctionSelections.includes(
                    functionOption.replace(/\s+/g, "_"),
                  )}
                />
                <label htmlFor={`tool-function-${index}`}>
                  {functionOption.replace(/_/g, " ")}
                </label>
              </div>
            ))}
          </div>

          <p className="dashboard-toolFunction">Company</p>
          <select
            value={selectedCompany}
            onChange={handleCompanyChange}
            className="dropdown"
          >
            <option value="">Select a Company</option>
            {filterOptionsForCompany.map((company, index) => (
              <option key={index} value={company}>
                {company}
              </option>
            ))}
          </select>

          <button
            onClick={handleFilterSubmit}
            className="dashboard-button-tools"
          >
            Apply Filters
          </button>
        </div>

        <div>
          <table className="dashboard-table-tools">
            <thead>
              <tr>
                <th>Tool Name</th>
                <th>Tool Function</th>
                <th>Company</th>
                <th>Aviation Specific</th>
                <th>Maturity Level</th>
              </tr>
            </thead>
            <tbody>
              {itemsToDisplay.map((tool) => (
                <tr
                  key={tool.Tool_ID}
                  onClick={() => handleRowClick(tool.Tool_ID)}
                  className="dashboard-table-row-tools"
                >
                  <td>{tool.Tool_Name}</td>
                  <td>{tool.Tool_Function}</td>
                  <td>{tool.Company}</td>
                  <td>{tool.Aviation_Specific ? "Yes" : "No"}</td>
                  <td>{tool.Maturity_Level}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button
              className="pagination-button"
              onClick={handlePreviousPageClick}
            >
              &lt;
            </button>
            <button className="pagination-button" onClick={handleNextPageClick}>
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ToolTable;
