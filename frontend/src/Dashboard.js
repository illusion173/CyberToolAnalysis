import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import ToolTable from "./dashboardTableComponent.js";
function Dashboard() {

    //Hello 
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
            <div>
                <button className="dashboard-button-tools" onClick={handleAccountInfo}>
                    Account Information
                </button>
            </div>
            <ToolTable></ToolTable>
    
        </div>
    );
    
                }


export default Dashboard;
