import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import {
  fetchToolDashboardList,
  fetchSingularToolData,
} from "./dashboardFunctionsAPI.js";
import ShowToolData from "./ShowToolData.js";

import {
  tool_function_categories_cleaner_dict,
  filterOptionsForCompany,
} from "./dashboardConstants.js";

function ToolTable() {
  // Pagination state and handlers
  const [currentPage, setCurrentPage] = useState(1);
  const [toolData, setToolData] = useState([]);
  const [loadCount, setLoadCount] = useState(0);
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState({});
  const [filterInput, setFilterInput] = useState({});
  const [itemsToDisplay, setItemstoDisplay] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [singularToolData, setSingularToolData] = useState({});
  const [selectedToolFunctionFilter, setSelectedToolFunctionFilter] =
    useState("");
  const [aiMlUse, setAiMlUse] = useState(false);
  const [aviationSpecific, setAviationSpecific] = useState(false);
  const [toolBox, setToolBox] = useState(false);
  const [maturityLevel, setMaturityLevel] = useState([]);
  const [selectedCompany, setCompanyFilter] = useState("");

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const itemsPerPage = 10;

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

  useEffect(() => { }, []);

  const wipeCache = () => {
    setFilterInput([]);
    setLastEvaluatedKey({});
    setToolData([]);
    setCurrentPage(1);
    setItemstoDisplay([]);
  };

  // We need to build the form submission here
  const handleFilterSubmit = async () => {
    let filter_submission = {};
    // Adding properties conditionally
    //

    if (aiMlUse) {
      filter_submission["AI/ML_Use"] = aiMlUse;
    }
    if (aviationSpecific)
      filter_submission.Aviation_Specific = aviationSpecific;
    if (selectedToolFunctionFilter)
      filter_submission.Tool_Function = selectedToolFunctionFilter;
    if (maturityLevel && maturityLevel.length > 0)
      filter_submission.Maturity_Level = maturityLevel;
    if (toolBox) filter_submission.ToolBox = toolBox;
    if (selectedCompany) filter_submission.Company = selectedCompany;

    let response = await fetchToolDashboardList(filter_submission, {});
    let tool_list = response[0] || {};
    let lek = response[1] || {};
    setSelectedToolFunctionFilter("");
    setAiMlUse(false);
    setAviationSpecific(false);
    setToolBox(false);
    setMaturityLevel([]);
    setCompanyFilter("");
    setToolData(tool_list);
    setLastEvaluatedKey(lek);

    console.log(filter_submission);
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
    setFilterInput(filter_from_frontend);
    // We set the user to the beginninng of whatever they queried.
    let response = await fetchToolDashboardList(filterInput, {});
    let tool_list = response[0] || {};
    let lek = response[1] || {};
    setToolData(tool_list);
    setLastEvaluatedKey(lek);
    //ItemstoDisplay();
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

  const handleRowClick = async (tool_id, tool_function) => {
    //NAVIGATE TO SINGULAR TOOL PAGE HERE!
    let singular_tool_data = await fetchSingularToolData(
      tool_id,
      tool_function,
    );
    setIsModalVisible(true); // Show the modal
    setSingularToolData(singular_tool_data);
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const handlePreviousPageClick = (e) => {
    // Ensure currentPage does not go below 1
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }

    ItemstoDisplay();
  };

  const handleCheckboxChangeMaturityLevel = (event) => {
    const selectedLevel = parseInt(event.target.value, 10); // Parse the checkbox value to an integer
    setMaturityLevel((prevLevels) => {
      if (prevLevels.includes(selectedLevel)) {
        // If the array already contains this level, remove it
        return prevLevels.filter((level) => level !== selectedLevel);
      } else {
        // Otherwise, add this level to the array
        return [...prevLevels, selectedLevel];
      }
    });
  };

  const handleFilterOpen = () => {
    setIsFilterVisible(!isFilterVisible); // Toggle visibility
    return <div></div>;
  };

  return (
    <div>
      <div>
        <button
          onClick={() => handleRefreshClick()}
          className="dashboard-button-tools"
        >
          Refresh
        </button>
        <button
          className="dashboard-button-tools"
          onClick={() => handleFilterOpen()}
        >
          Filter
        </button>
        {isFilterVisible && (
          <div className="drop-down-filter-window">
            <div className="filter-layout">
              {/* FILTER FUNCTION HERE*/}
              <div className="form-group">
                {/*DROPDOWN TOOL FUNCTION*/}
                <label className="form-group-label">
                  Tool Function:
                  <select
                    value={selectedToolFunctionFilter}
                    onChange={(e) =>
                      setSelectedToolFunctionFilter(e.target.value)
                    }
                  >
                    <option value="">Select Tool Function</option>

                    {Object.entries(tool_function_categories_cleaner_dict).map(
                      ([key, value]) => (
                        <option key={value} value={value}>
                          {key}
                        </option>
                      ),
                    )}
                  </select>
                </label>
              </div>
              <div className="form-group">
                {/*DROPDOWN Parent Company FUNCTION*/}
                <label className="form-group-label">
                  Parent Company:
                  <select
                    value={selectedCompany}
                    onChange={(e) => setCompanyFilter(e.target.value)}
                  >
                    <option value="">Select Parent Company</option>

                    {Object.entries(filterOptionsForCompany).map(
                      ([key, value]) => (
                        <option key={value} value={value}>
                          {key}
                        </option>
                      ),
                    )}
                  </select>
                </label>
              </div>

              <div className="form-group">
                <label className="form-group-label">Maturity Level</label>
                <div>
                  {[1, 2, 3, 4].map((level) => (
                    <label key={level}>
                      <input
                        type="checkbox"
                        name="maturityLevel"
                        value={level} // This sets the value attribute to an integer, but it will be a string when read from the event
                        checked={maturityLevel.includes(level)} // No need to convert to string here since we're working with integers
                        onChange={handleCheckboxChangeMaturityLevel}
                      />
                      {level}
                    </label>
                  ))}
                </div>
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
              <button
                className="dashboard-button-tools"
                onClick={() => handleFilterSubmit()}
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {/*END OF FILTER HERE */}

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
                  onClick={() =>
                    handleRowClick(tool.Tool_ID, tool.Tool_Function)
                  }
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
        </div>
      </div>
      <div>
        <span className="pagination">
          <button className="pagination" onClick={handlePreviousPageClick}>
            &lt;
          </button>
          <button className="pagination" onClick={handleNextPageClick}>
            &gt;
          </button>
        </span>
      </div>

      {isModalVisible && (
        <div className="modal-backdrop" onClick={hideModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <ShowToolData tool_data={singularToolData} />
            {/* Optionally, add a close button inside ShowToolData or here */}
            <button onClick={() => setIsModalVisible(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ToolTable;
