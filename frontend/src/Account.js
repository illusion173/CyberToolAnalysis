import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "./Account.css";
import { Auth } from "aws-amplify";
import { API } from "aws-amplify";

function Account () {
    const navigate = useNavigate();
    const handleBackToDashboard = (e) => {
        navigate("/Dashboard");
    };

    return(
        <div className = "Account">
            <p className = "dashboard-welcome"> Account information:</p>
            <button className= "dashboard-button" onClick={handleBackToDashboard}>
                Back To Dashboard
            </button>

        </div>
    )


}
export default Account;