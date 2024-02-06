import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { API } from "aws-amplify";
import { fetchJwt } from "./helperFunctionsForUserAPI.js";

function Dashboard() {
    // Pagination state and handlers
    const [currentPage, setCurrentPage] = useState(1);
    const [toolData, setToolData] = useState([]);
    const [lastEvaluatedKey, setLastEvaluatedKey] = useState({});
    const [filterInput, setFilterInput] = useState({});
    const [itemsToDisplay, setItemstoDisplay] = useState([]);
    const navigate = useNavigate();
    const itemsPerPage = 10;

    useEffect(() => {
        // If this is bothering theuncaught runtime error thing "no current user on localhost"
        // Comment the line below me!
        setFilterInput({});
        fetchToolDashboardList(true);
    }, []);

    // On update of filter
    const updateFilterRequery = async (filter_from_frontend) => {
        setFilterInput(filter_from_frontend);
        fetchToolDashboardList(true);
    };

    const formatString = (value) => {
        return typeof value === "string" ? value.replace(/_/g, " ") : value;
    };

    // Main handler for all API requests to obtain tool data.

    const fetchToolDashboardList = async (wipe) => {
        if (wipe) {
            setToolData([]);
            setLastEvaluatedKey({});
            setCurrentPage(0);
            ItemstoDisplay([]);
        }

        const jwt = await fetchJwt();
        try {
            const apiName = "apib5cf8c70";
            const path = "/fetchDashboard";

            const headers = {
                Authorization: `Bearer ${jwt}`,
            };

            const requestBody = {
                filter_input: filterInput,
                last_evaluated_key: lastEvaluatedKey,
            };

            const myInit = {
                headers,
                body: requestBody,
            };

            let response = await API.post(apiName, path, myInit);
            // Process and format response data before setting state
            const formattedData = response["tool_list"].map((tool) => ({
                ...tool,
                Tool_Name: formatString(tool.Tool_Name),
                Tool_Function: formatString(tool.Tool_Function),
                Company: formatString(tool.Company),
                // Apply formatString to other fields if necessary
            }));

            // Append new data to existing toolData state

            setToolData((prevToolData) => [...prevToolData, ...formattedData]);
            ItemstoDisplay();
            setLastEvaluatedKey(response["last_evaluated_key"]);
        } catch (error) {
            console.log(error);
            alert("Unable to retrieve tool list");
        }
    };

    /*
                              
                                  const fetchSingularToolData = async (tool_id) => {
                                      const jwt = await fetchJwt();
                              
                                      try {
                                          const apiName = "apiab9b8614";
                                          const path = "/getDefaultDashboard";
                              
                                          const headers = {
                                              Authorization: `Bearer ${jwt}`,
                                          };
                              
                                          const requestBody = {
                                              tool_id: `${tool_id}`,
                                          };
                              
                                          const myInit = {
                                              headers,
                                              body: requestBody,
                                          };
                              
                                          let response = await API.post(apiName, path, myInit);
                                          console.log(response);
                                      } catch (error) {
                                          alert("Unable to retrieve tool data for " + tool_id);
                                      }
                                  };
                              
                                  */

    // NAVIGATION TO DIFFERENT PAGES
    const handleQuestionnaireClick = (e) => {
        navigate("/Questionnaire");
    };

    const handleReportListClick = (e) => {
        navigate("/ReportList");
    };

    const handleRowClick = (tool_id) => {
        //NAVIGATE TO SINGULAR TOOL PAGE HERE!
        //fetchSingularToolData(tool_id);
    };
    const handleAccountInfo = (e) => {
        navigate("/Account");
    };

    /*
                                                                                                                                const exampleToolData = [
                                                                                                                                    {
                                                                                                                                        Maturity_Level: 3, // Assuming conversion to a simple number
                                                                                                                                        Tool_ID: "LA_00",
                                                                                                                                        ToolBox: true,
                                                                                                                                        Aviation_Specific: true,
                                                                                                                                        Tool_Function: "Log_Analysis",
                                                                                                                                        "AI/ML_Use": false,
                                                                                                                                        Company: "Airbus",
                                                                                                                                        Customers: [
                                                                                                                                            "EasyJet",
                                                                                                                                            "LATAM",
                                                                                                                                            "WOW_Air",
                                                                                                                                            "Peach_Aviation",
                                                                                                                                            "Emirates",
                                                                                                                                            "Bangkok_Airlines",
                                                                                                                                            "AirAsia",
                                                                                                                                            "Asian_Airlines",
                                                                                                                                            "Ethihad_Airlines",
                                                                                                                                        ], // Assuming conversion to an array
                                                                                                                                        Tool_Name: "Skywise",
                                                                                                                                    },
                                                                                                                                ];
                                                                                                                            
                                                                                                                                */

    const ItemstoDisplay = (e) => {
        // Calculate start and end indices for slicing the toolData array
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const listOfItemsToDisplay = toolData.slice(startIndex, endIndex - 1);
        setItemstoDisplay(listOfItemsToDisplay);
    };

    const handleNextPageClick = (e) => {
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
            fetchToolDashboardList(false); // Pass false to not wipe data, fetching and appending new items instead
        }

        // Update currentPage only if there are more items to display
        // This can be adjusted based on how you want to handle the UI when no more items are available
        if (
            toolData.length > currentPageIndex + itemsPerPage ||
            Object.keys(lastEvaluatedKey).length !== 0
        ) {
            setCurrentPage(currentPage + 1);
            setItemstoDisplay();
        } else {
            // Optionally, handle the scenario when no more data is available
            alert("No more items to display.");
        }
    };

    const handlePreviousPageClick = (e) => {
        // Ensure currentPage does not go below 1
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }

        ItemstoDisplay();
    };

    const options = ["all", "date released", "price"];

    const handleFilterChange = (e) => {
        updateFilterRequery(e.target.value);
    };

    const Dropdown = ({ trigger, menu }) => {
        const [open, setOpen] = useState(false);

        const handleOpen = () => {
            setOpen(!open);
        };

        return (
            <div className="dropdown">
                {React.cloneElement(trigger, {
                    onClick: handleOpen,
                })}
                {open ? (
                    <ul className="menu">
                        {menu.map((menuItem, index) => (
                            <li key={index} className="menu-item">
                                {React.cloneElement(menuItem, {
                                    onClick: () => {
                                        menuItem.props.onClick();
                                        setOpen(false);
                                    },
                                })}
                            </li>
                        ))}
                    </ul>
                ) : null}
            </div>
        );
    };
    return (
        <div className="App">
            <p className="dashboard-welcome">Welcome to your Dashboard!</p>

            <header>
                <input
                    id="search"
                    type="search"
                    placeholder="&#x1F50D; Start typing to search..."
                />
            </header>

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

            {/* Render the tool data in a table */}
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

                <button className="dashboard-button-tools" onClick={handleAccountInfo}>
                    Account Information
                </button>

                <div className="filter-dropdown">
                    <label htmlFor="status-filter"> Filter by Status</label>
                    <select id="status-filter" onChange={handleFilterChange}>
                        {options.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
