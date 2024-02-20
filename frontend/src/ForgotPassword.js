import "./App.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from 'aws-amplify';

import awsExports from "./aws-exports";
import { Amplify } from 'aws-amplify';

Amplify.configure(awsExports);

function ForgotPassword() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [code, setCode] = useState(""); // For the verification code
    const [newPassword, setNewPassword] = useState(""); // For the new password
    const [stage, setStage] = useState(1); // Stage 1: Enter Email, Stage 2: Enter Verification Code and New Password

    // Email validation function
    const isValidEmail = email => {
        // Simple regex for basic email validation
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    async function handleForgotPassword(username) {
        if (!isValidEmail(username)) {
            alert("Please enter a valid email address.");
            return;
        }
        try {
            await Auth.forgotPassword(username);
            alert("Password reset code sent successfully. Check your email.");
            setStage(2); // Move to the next stage
        } catch (err) {
            console.error("Error in sending password reset code:", err);
            alert("Error sending password reset code. Please check the email provided and try again.");
        }
    }

    async function handleResetPassword(username, code, newPassword) {
        try {
            await Auth.forgotPasswordSubmit(username, code, newPassword);
            alert("Password has been successfully reset. You can now log in with the new password.");
            navigate("/login"); // Redirect to the login page
        } catch (err) {
            console.error("Error in resetting password:", err);
            alert("Error resetting password. Please check the code and new password and try again.");
        }
    }

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        handleForgotPassword(username);
    };

    const handleResetSubmit = (e) => {
        e.preventDefault();
        handleResetPassword(username, code, newPassword);
    };

    return (
        <div className="center-container">
            <div className="login-form">
                {stage === 1 && (
                    <>
                        <h2 className="bold-text">Forgot Password?</h2>
                        <form onSubmit={handleEmailSubmit}>
                            <div>
                                <label className="bold-text">Email:</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <button className="green-button" type="submit">Send Code</button>
                        </form>
                    </>
                )}
                {stage === 2 && (
                    <>
                        <h2 className="bold-text">Reset Password</h2>
                        <form onSubmit={handleResetSubmit}>
                            <div>
                                <label className="bold-text">Verification Code:</label>
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="bold-text">New Password:</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <button className="green-button" type="submit">Reset Password</button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
export default ForgotPassword;
