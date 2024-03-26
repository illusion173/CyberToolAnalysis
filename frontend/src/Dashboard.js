import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import ToolTable from "./dashboardTableComponent.js";
import Navbar from "./navbar.js";
function Dashboard() {
    const navigate = useNavigate();

    useEffect(() => { }, []);

    const handleAccountInfo = (e) => {
        navigate("/Account");
    };

    return (
        <div className="App">
            <p className="dashboard-welcome">Welcome to CyberTool</p>
            <Navbar></Navbar>

            <ToolTable></ToolTable>
            <div>
                <button className="dashboard-button-tools" onClick={handleAccountInfo}>
                    Account Information
                </button>
            </div>
        </div>
    );
}

export default Dashboard;
