import { useNavigate } from "react-router-dom"
import './Dashboard.css';
import React, { useState } from "react";
import { Auth } from 'aws-amplify';

function Dashboard() {
    const navigate = useNavigate();
    const handleReportListClick = (e) => {
        navigate("/ReportList")
    }
    const handleQuestionnaireClick = (e) => {
        navigate("/Questionnaire")


    }

    //example data array
    const data = [
        { name: "Boeing AnalytX", version: 19, status: "active", launchdate: "10/21/2011" },
        { name: "Predikto", version: 25, status: "active", launchdate: "01/02/2001" },
        { name: "Fleet Complete Aviation", version: 34, status: "active", launchdate: "05/02/1884" },
        { name: "Honeywell Forge", version: 19, status: "active", launchdate: "04/45/2014" },
        { name: "IFS Maintenix", version: 19, status: "active", launchdate: "03/45/2003" },
        { name: "GE Aviation Digital Solutions", version: 25, status: "active", launchdate: "05/20/2015" },
        { name: "Lufthansa Technique Aviatar", version: 34, status: "active", launchdate: "09/21/2023" },
        { name: "Palo Alto Networks Firewall", version: 67, status: "active", launchdate: "None" },
        { name: "Symantec Endpoint Protection", version: 3, status: "active", launchdate: "None" },
        { name: "OpenVPN", version: 9, status: "active", launchdate: "None" },
        { name: "Cisco ASA", version: 3, status: "active", launchdate: "None" },
        { name: "Fortinet FortiClient", version: 5, status: "active", launchdate: "None" },
        { name: "Okta", version: 2, status: "active", launchdate: "None" },
        { name: "Idegy", version: 12, status: "active", launchdate: "None" },
        { name: "Dragos", version: 14, status: "active", launchdate: "None" },


    ];


    // Pagination state and handlers
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const totalPages = Math.ceil(data.length / itemsPerPage);

    // Handlers for pagination
    const goToNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const goToPreviousPage = () => {
        setCurrentPage(currentPage - 1);
    };

    // Slice the data array to get the items for the current page
    const currentData = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );




    

    const DropDownMenu = () => {
        const [open, setOpen] = React.useState(false);

        const handleOpen = () => {
            setOpen(!open);
        };

        const handleMenuOne = () => {
            console.log('clicked one');
        };

        const handleMenuTwo = () => {
            console.log('clicked two');
        };

        const handleMenuThree = () => {
            console.log('clicked three');
        };

        const handleMenuFour = () => {
            console.log('clicked four');
        };

        const handleMenuFive = () => {
            console.log('clicked five');
        };





        return (
            <DropDownMenu
                trigger={<button>Dropdown</button>}
                menu={[
                    <button onClick={handleMenuOne}>Maturity</button>,
                    <button onClick={handleMenuTwo}>Company</button>,
                    <button onClick={handleMenuThree}>Commmercial</button>,
                    <button onClick={handleMenuFour}>Personal</button>,
                    <button onClick={handleMenuFive}>Coolness</button>,

                ]}
            />
        );
    }

    const Dropdown = ({ trigger, menu }) => {
        const [open, setOpen] = React.useState(false);

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
        )
    };


    return (
        <div className="App">
            <p className="dashboard-welcome">Welcome to your Dashboard!</p>
            <button className="dashboard-button" onClick={handleReportListClick}>Report Menu</button>
            <button className="dashboard-button" onClick={handleQuestionnaireClick}>Questionnaire</button>
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
            <div className = "pagination">
                <button onClick= {goToPreviousPage} disabled = {currentPage ===1}>
                    {"<"}
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button onClick = {goToNextPage} disabled = {currentPage === totalPages}>
                    {">"}
                </button>
            </div>


            {/* Your Dropdown Menu Here */}
        </div>
    );
};
export default Dashboard;
