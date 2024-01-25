import "./App.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from 'aws-amplify'; // Import Auth from AWS Amplify

import awsExports from "./aws-exports";
import { Amplify } from 'aws-amplify';

Amplify.configure(awsExports);

function ForgotPassword() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");

    async function handleForgotPassword(username) {
        try {
          const data = await Auth.forgotPassword(username);
          console.log(data);
          navigate("/resetpassword");
        } catch (err) {
          console.log(err);
        }
      };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleForgotPassword();
    };

    return(
        <div className="center-container">
            <h1>CyberTools</h1>
            <div classname=".login-form">
                <h2 className="login-message">Forgot Password?</h2>
                <form onSubmit={handleSubmit}>
                    <label classname="login-label" htmlFor="email">Email:</label>
                    <input
                        className="login-input"
                        type="text"
                        id='email'
                        name="email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <button className="login-button" type="submit">Send Code</button>
                </form>
            </div>
        </div> 
    );
}

export default ForgotPassword;