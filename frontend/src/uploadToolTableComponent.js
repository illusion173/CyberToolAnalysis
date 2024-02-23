import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import {
  fetchToolDashboardList,
  fetchSingularToolData,
  sendApproval,
  sendDenial,
} from "./UploadToolAPI.js";
import ShowToolData from "./ShowToolData.js";

function UploadToolTable() {
  // Pagination state and handlers
  const [currentPage, setCurrentPage] = useState(1);
  const [toolData, setToolData] = useState([]);
  const [loadCount, setLoadCount] = useState(0);
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState({});
  const [filterInput, setFilterInput] = useState({});
  const [itemsToDisplay, setItemstoDisplay] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [singularToolData, setSingularToolData] = useState({});

  const itemsPerPage = 10;
  const navigate = useNavigate();

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

  const handleApproveToolClick = (tool_id, tool_function) => {
    let response = sendApproval(tool_id, tool_function);
    //window.location.reload();
  };

  const handleDenyToolClick = (tool_id, tool_function) => {
    let response = sendDenial(tool_id, tool_function);
    //window.location.reload();
  };

  const handleFormNewToolClick = () => {
    navigate("/uploadtoolform");
  };

  return (
    <div>
      <div>
        <span>
          <button
            onClick={() => handleRefreshClick()}
            className="dashboard-button-tools"
          >
            Refresh
          </button>
          <button
            className="dashboard-button-tools"
            onClick={() => handleFormNewToolClick()}
          >
            New Tool
          </button>
        </span>
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
              <th>Submit</th>
            </tr>
          </thead>
          <tbody>
            {itemsToDisplay.map((tool) => (
              <tr
                key={tool.Tool_ID}
                onClick={() => handleRowClick(tool.Tool_ID, tool.Tool_Function)}
                className="dashboard-table-row-tools"
              >
                <td>{tool.Tool_Name}</td>
                <td>{tool.Tool_Function}</td>
                <td>{tool.Company}</td>
                <td>{tool.Aviation_Specific ? "Yes" : "No"}</td>
                <td>{tool.Maturity_Level}</td>
                <td>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click event
                      handleApproveToolClick(tool.Tool_ID, tool.Tool_Function);
                    }}
                    className="dashboard-button-approve"
                  >
                    Approve
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click event
                      handleDenyToolClick(tool.Tool_ID, tool.Tool_Function);
                    }}
                    className="dashboard-button-deny"
                  >
                    Deny
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
            <button
              className="lower-button"
              onClick={(e) => {
                e.stopPropagation(); // Prevent row click event
                handleApproveToolClick(
                  singularToolData.Tool_ID,
                  singularToolData.Tool_Function,
                );
              }}
            >
              Approve
            </button>
            <button
              className="lower-button"
              onClick={() => setIsModalVisible(false)}
            >
              Close
            </button>
            <button
              className="lower-button"
              onClick={(e) => {
                e.stopPropagation(); // Prevent row click event
                handleDenyToolClick(
                  singularToolData.Tool_ID,
                  singularToolData.Tool_Function,
                );
              }}
            >
              Deny
            </button>
            {/* Optionally, add a close button inside ShowToolData or here */}
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadToolTable;
