import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "./Dashboard.css";
import { API } from "aws-amplify";
import { fetchJwt } from "./helperFunctionsForUserAPI.js";

function Dashboard() {
    const navigate = useNavigate();

    // Pagination state and handlers
    const [currentPage, setCurrentPage] = useState(1);
    const [toolData, setToolData] = useState([]);
    const [totalPages, setTotalPages] = useState(0);

    const fetchToolDashboardList = async () => {
        const jwt = await fetchJwt();
        try {
            const apiName = "apiab9b8614";
            const path = "/getDefaultDashboard";

            const headers = {
                Authorization: `Bearer ${jwt}`,
            };

            const myInit = {
                headers,
            };

            let response = await API.post(apiName, path, myInit);
            console.log(response);
        } catch (error) {
            alert("Unable to retrieve tool list");
        }
    };

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

    const handleQuestionnaireClick = (e) => {
        navigate("/Questionnaire");
    };

    const handleReportListClick = (e) => {
        navigate("/ReportList");
    };

    // Handlers for pagination
    const goToNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const goToPreviousPage = () => {
        setCurrentPage(currentPage - 1);
    };
    /*
                // Slice the data array to get the items for the current page
                const currentData = data.slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage,
                );
                */
    return (
        <div className="App">
            <p className="dashboard-welcome">Welcome to your Dashboard!</p>
            <button className="dashboard-button" onClick={handleReportListClick}>
                Report Menu
            </button>
            <button className="dashboard-button" onClick={handleQuestionnaireClick}>
                Questionnaire
            </button>
        </div>
    );
}

export default Dashboard;
