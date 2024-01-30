import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "./Dashboard.css";
import { Auth } from "aws-amplify";
import { API } from "aws-amplify";

function Dashboard() {
    const navigate = useNavigate();

    //const CyberTool = getCyberTools();

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



    //console.log(CyberTool);

    const data = [
        {
            name: "Boeing AnalytX",
            version: 19,
            status: "active",
            launchdate: "10/21/2011",
        },
        {
            name: "Predikto",
            version: 25,
            status: "active",
            launchdate: "01/02/2001",
        },
        {
            name: "Fleet Complete Aviation",
            version: 34,
            status: "active",
            launchdate: "05/02/1884",
        },
        {
            name: "Honeywell Forge",
            version: 19,
            status: "active",
            launchdate: "04/45/2014",
        },
        {
            name: "IFS Maintenix",
            version: 19,
            status: "active",
            launchdate: "03/45/2003",
        },
        {
            name: "GE Aviation Digital Solutions",
            version: 25,
            status: "active",
            launchdate: "05/20/2015",
        },
        {
            name: "Lufthansa Technique Aviatar",
            version: 34,
            status: "active",
            launchdate: "09/21/2023",
        },
        {
            name: "Palo Alto Networks Firewall",
            version: 67,
            status: "active",
            launchdate: "None",
        },
        {
            name: "Symantec Endpoint Protection",
            version: 3,
            status: "active",
            launchdate: "None",
        },
        { name: "OpenVPN", version: 9, status: "active", launchdate: "None" },
        { name: "Cisco ASA", version: 3, status: "active", launchdate: "None" },
        {
            name: "Fortinet FortiClient",
            version: 5,
            status: "active",
            launchdate: "None",
        },
        { name: "Okta", version: 2, status: "active", launchdate: "None" },
        { name: "Idegy", version: 12, status: "active", launchdate: "None" },
        { name: "Dragos", version: 14, status: "active", launchdate: "None" },
    ];

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const handleQuestionnaireClick = (e) => {
        navigate("/Questionnaire");
    };

    const handleReportListClick = (e) => {
        navigate("/ReportList");
    };

    const handleAccountInfo = (e) => {
        navigate("/Account");
    };

    //Handlers for pagnation
    const goToNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const goToPreviousPage = () => {
        setCurrentPage(currentPage - 1);
    };


    //Slice data array
    const currentData = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
    );

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


            <table className="dashboard-table">
                <thead>
                    <tr>
                        <th>Tool Name</th>
                        <th>Version</th>
                        <th>Status</th>
                        <th>Launch Date</th>
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((val, key) => (
                        <tr key={key}>
                            <td>{val.name}</td>
                            <td>{val.version}</td>
                            <td>{val.status}</td>
                            <td>{val.launchdate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                <button onClick={goToPreviousPage} disabled={currentPage === 1}>
                    {"<"}
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button onClick={goToNextPage} disabled={currentPage === totalPages}>
                    {">"}
                </button>
            </div>
        </div>
    );
}

export default Dashboard;
