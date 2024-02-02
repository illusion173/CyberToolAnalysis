import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "./Dashboard.css";
import { API } from "aws-amplify";
import { fetchJwt } from "./helperFunctionsForUserAPI.js";


function Dashboard() {
    const navigate = useNavigate();

    async function getToken() {
        Auth.currentSession().then((res) => {
            let accessToken = res.getAccessToken();
            let jwt = accessToken.getJwtToken();
            //You can print them to see the full objects
            console.log(`myAccessToken: ${JSON.stringify(accessToken)}`);
            console.log(`myJwt: ${jwt}`);
        });
    }

    async function getCyberTools() {
        const apiName = "apifdfc7a6f";

        const path = "/tools/getAll";

        const myInit = {
            headers: {
                Authorization: `Bearer ${(await Auth.currentSession())
                    .getIdToken()
                    .getJwtToken()}`,
            },
        };
        return await API.get(apiName, path, myInit);
    }


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

    const handleAccountInfo = (e) => {
        navigate("/Account");
    };








    //Filtering 
    const [filter,setFilter] = useState('all');

    const options = ['all', 'date released','price'];

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    }

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
    (async () => { })();

    return (
        <div className="App">
            <p className="dashboard-welcome">Welcome to your Dashboard!</p>

            <header>
                    <input id = "search" type = "search" placeholder = "&#x1F50D; Start typing to search..." />
            </header>


            <button className="dashboard-button" onClick={handleReportListClick}>
                Report Menu
            </button>
            <button className="dashboard-button" onClick={handleQuestionnaireClick}>
                Questionnaire
            </button>


            <button className="dashboard-button" onClick={handleAccountInfo}>
                Account Information
            </button>

            <div className = "filter-dropdown">
                <label htmlFor = "status-filter"> Filter by Status</label>
                <select id = "status-filter" onChange = {handleFilterChange}>
                    {options.map ((option,index) => (
                        <option key={index} value = {option}>{option}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default Dashboard;
