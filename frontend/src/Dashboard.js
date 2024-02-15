import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import ToolTable from "./dashboardTableComponent.js";
function Dashboard() {
    const navigate = useNavigate();

    useEffect(() => { }, []);
    const [filterInput, setFilterInput] = useState({});
    const [toolFunctionSelections, setToolFunctionSelections] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState('');

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

    // Just for outputting JSON as an alert for testing, will be taken off later
    useEffect(() => {
        alert(JSON.stringify(filterInput));
    }, [filterInput]);


    // Used to update tool_functions key in filterInput state
    useEffect(() => {
        setFilterInput(prev => ({ ...prev, Tool_Functions: toolFunctionSelections })); //updates every time the toolFunctionSelections state changes
    }, [toolFunctionSelections]);


    // updates process for the tool_functions key based on what the user chose
    useEffect(() => {
        if (toolFunctionSelections.length > 0) {
            // If there are selected tool functions, add/replace the tool_functions key in filterInput
            const updatedToolFunctions = toolFunctionSelections.map(tf => tf.replace(/\s+/g, '_')); // Use underscore for JSON
            setFilterInput(prevFilterInput => ({ ...prevFilterInput, Tool_Functions: updatedToolFunctions }));
        } else {
            // If there are no selections, take off the tool_functions key from filterInput
            const { Tool_Functions, ...restFilterInput } = filterInput;
            setFilterInput(restFilterInput);
        }
    }, [toolFunctionSelections]);


    const handleCompanyChange = (event) => {
        const companyName = event.target.value; //Gets user's company choice
    
        //Checks if a company name was selected
        setFilterInput(prev => {
            // If the compant name is not an empty string, it replaces spaces with underscores for JSON
            if (companyName.trim() !== "") {
                const companyNameForJson = companyName.replace(/\s+/g, '_');
                return { ...prev, Company: companyNameForJson };
            } else {
                // If the company name is empty, remove the company key from the filterInput state
                const { Company, ...rest } = prev; //Destructures filterInput state to exlude the company key and keeps the rest so no keys are in JSON
                return rest;
            }
        });
    
        // Update the selected company state
        setSelectedCompany(companyName);
    };

    const formatString = (value) => {
        return typeof value === "string" ? value.replace(/_/g, " ") : value; //for string

    };

    const handleToolFunction = (e) => {
        const {value, checked} = e.target; //Value is the tool, checked is the boolean
        const adjustedValue = value.replace(/\s+/g, '_');
    

        setToolFunctionSelections(prevSelections => {
            const newSelections = new Set(prevSelections); // Set is for no duplicates
            if (checked) {  
                newSelections.add(adjustedValue); //Underscored tool function is added to set 
            } else {
                newSelections.delete(adjustedValue);//Underscored tool is removed for deselecting tool
            }
            return [...newSelections]; // Converted back to array
        });
    };

    // All the options 
    const filterOptions = ['Aviation Specific', 'Tool Box','Maturity Level 1', 'Maturity Level 2','Maturity Level 3','Maturity Level 4','AI/ML Use'];
    const filterOptionsForToolFunction = ['Aircraft Log & Anamaly Detection Tools', 'Firewall and Network Security', 'Endpoint Security', 'Secure Communication and Data Encryption',
'Access Control and Identity Management', 'Security Information and Event Management (SIEM) Systems','Vulnerability Management', 'Threat Intelligence Platforms',
'Supply Chain Risk Management Solution', 'Regulatory Compliance Tools', 'Aviation Focused Tools', 'General Tools', 'Industrial Control Systems Cyber Tools'];
    const filterOptionsForCompany = ['Airbus', 'Jepperson', 'Cisco', 'Fortinet', 'Check Point','SonicWall','Sophos', 'WatchGuard','Palo Alto', 'McAfee','Darktrace','Vectra','VMWare','Cylance','Sophos','Bitdefender','Fidelis',
'SentinelOne','Tanium','CrowdStrike','Cisco','Okta','Microsoft','Ping','Splunk','IBM','Tenable','Rapid7','ThreatConnect','Mandiant',"Anomali",'Recorded Future','MasterCard','Tripwire','SolarWinds','CyberArk','Fireye','Palo Alto Networks','WithSecure',
'Trendo Micro','Claroty','Nozomi Networks','Dragos','ForeScout Technologies','Boeing','AT&T','CISCO','Vectra'];


    //For the maturity JSON, it needs to be an int if only one maturity level is selected. 
    // If more than one is selected, then it's an array
    const handleMaturityLevel = (e) => {
        const { value, checked } = e.target;
        // Checks to see if it's a maturity level input
        const isMaturityLevel = value.startsWith("Maturity Level");
    
        if (isMaturityLevel) {
            const level = parseInt(value.split(" ")[2], 10); //Splits the string and converts last part to an int whcih is maturity level
    
            setFilterInput(prev => {
                let previousLevels = prev.Maturity_Level;
                //If this state isnt an array, it makes sure the variable is set to array format, even if empty
                if (!Array.isArray(previousLevels)) {
                    previousLevels = previousLevels ? [previousLevels] : [];
                }
    
                let updatedLevels;
                // I If the input is checked, it adds the level to the array of other selected levels
                if (checked) {
                    updatedLevels = Array.from(new Set([...previousLevels, level])).sort((a, b) => a - b); //Using a set to make sure there are no duplicates
                } else {
                    updatedLevels = previousLevels.filter(l => l !== level);
                }
                
                // Decide how to update the state based on the updated levels
                if (updatedLevels.length === 0) {
                    //Remove Maturity level
                    const { Maturity_Level, ...rest } = prev;
                    return rest;
                } else if (updatedLevels.length === 1) {
                    // If only one maturity level is selected, store as int
                    return { ...prev, Maturity_Level: updatedLevels[0] };
                } else {
                    //If multiple are selected, store as array
                    return { ...prev, Maturity_Level: updatedLevels };
                }
            });
        } else {
            //non-maturity level filters remains unchanged
            setFilterInput(prev => ({
                ...prev,
                [value]: checked
            }));
        }
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
    
            <ToolTable></ToolTable>
            <div>
                <button className="dashboard-button-tools" onClick={handleAccountInfo}>
                    Account Information
                </button>
            </div>
    
            <div className="filter-section">
                {filterOptions.map((option, index) => {
                    const isMaturityLevel = option.startsWith("Maturity Level");
                    const level = isMaturityLevel ? parseInt(option.split(" ")[2], 10) : 0;
    
                    return (
                        <div key={index}>
                            <input
                                type="checkbox"
                                id={`checkbox-${index}`}
                                value={option}
                                onChange={handleMaturityLevel}
                                checked={
                                    isMaturityLevel ? 
                                    Array.isArray(filterInput["Maturity_Level"]) ? 
                                        filterInput["Maturity_Level"].includes(level) : 
                                        filterInput["Maturity_Level"] === level
                                    : filterInput[option] || false
                                }
                            />
                            <label htmlFor={`checkbox-${index}`}>{option}</label>
                        </div>
                    ); // Removed the erroneous </div> here
                })}
            </div>
    
            <p className="dashboard-toolFunction">Tool Function</p>
    
            <div className="filter-selection">
                {filterOptionsForToolFunction.map((functionOption, index) => (
                    <div key={index}>
                        <input
                            type="checkbox"
                            id={`tool-function-${index}`}
                            value={functionOption.replace(/_/g, ' ')}
                            onChange={handleToolFunction}
                            checked={toolFunctionSelections.includes(functionOption.replace(/\s+/g, '_'))}
                        />
                        <label htmlFor={`tool-function-${index}`}>{functionOption.replace(/_/g, ' ')}</label>
                    </div>
                ))}
            </div>
    
            <p className="dashboard-toolFunction">Company</p>
            <select value={selectedCompany} onChange={handleCompanyChange} className="dropdown">
                <option value="">Select a Company</option>
                {filterOptionsForCompany.map((company, index) => (
                    <option key={index} value={company}>
                        {company}
                    </option>
                ))}
            </select>
        </div>
    );
    
                }


export default Dashboard;
