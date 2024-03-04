import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./App.css";
import { Auth } from "aws-amplify";
import { API } from "aws-amplify";
import { Amplify } from 'aws-amplify';

function Account () {
    const navigate = useNavigate();
    const [username, setUsername] = useState();

    const handleBackToDashboard = (e) => {
        navigate("/Dashboard");
    };

    useEffect(() => {
        pullUsername();
    }, []);

    async function pullUsername() {
        try {
            const user = await Auth.currentAuthenticatedUser();
            setUsername(user.username);
            console.log(`The username: ${user.username}`);
            alert(username);
            return(user.username);
        } catch (err) {
            console.log(err);
        }
    };

    return(
        <div className = "login-form">
            <h2 className = "login-message"> Account Information</h2>
            <p className = "login-message">Username: {username}</p>
            <button className= "login-button" onClick={handleBackToDashboard}>
                Back To Dashboard
            </button>

        </div>
    );
}
export default Account;
