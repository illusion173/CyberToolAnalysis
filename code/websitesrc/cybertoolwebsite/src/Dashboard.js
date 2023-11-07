import { useNavigate } from "react-router-dom"
import './Dashboard.css';
import * as React from 'react';


function Dashboard() {
    const navigate = useNavigate();
    const handleReportListClick = (e) => {
        navigate("/ReportList")
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
    ];


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

        <div>
            <p>Welcome to your Dashboard!</p>
            <button onClick={handleReportListClick}>Report List</button>
            <table>
                <tr>
                    <th>Tool Name</th>
                    <th>Version</th>
                    <th>Status</th>
                    <th>Launch Date</th>
                </tr>
                {data.map((val, key) => {
                    return (
                        <tr key={key}>
                            <td>{val.name}</td>
                            <td>{val.version}</td>
                            <td>{val.status}</td>
                            <td>{val.launchdate}</td>
                        </tr>
                    )
                })}
            </table>

        </div >
    )
};
export default Dashboard;
