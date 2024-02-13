import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { fetchToolDashboardList } from "./dashboardFunctionsAPI.js";
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
        const getInitial = async () => {
            let response = await fetchToolDashboardList({}, {});
            setToolData(response[0]);
            setLastEvaluatedKey(response[1]);
            ItemstoDisplay();
        };

        getInitial();
    }, []);

    const handleRefreshClick = async () => {
        let response = await fetchToolDashboardList(filterInput, lastEvaluatedKey);
        setToolData(response[0]);
        setLastEvaluatedKey(response[1]);
        ItemstoDisplay();
    };

    // On update of filter
    const updateFilterRequery = async (filter_from_frontend) => {
        setFilterInput(filter_from_frontend);
        //fetchToolDashboardList(true);
    };

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

    const ItemstoDisplay = (e) => {
        // Calculate start and end indices for slicing the toolData array
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const listOfItemsToDisplay = toolData.slice(startIndex, endIndex - 1);
        setItemstoDisplay(listOfItemsToDisplay);
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

    const handleFilterChange = (e) => {
        updateFilterRequery(e.target.value);
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
            <button
                onClick={() => handleRefreshClick()}
                className="dashboard-button-tools"
            >
                Refresh
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
            </div>
        </div>
    );
}

export default Dashboard;
