import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from 'aws-amplify'; // Import Auth from AWS Amplify

import awsExports from "./aws-exports";
import { Amplify } from 'aws-amplify';

Amplify.configure(awsExports);

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSignIn = async () => {
        try {
            const user = await Auth.signIn(username, password);
          //  console.log(user); // You can remove this after confirming it works
            navigate("/dashboard"); // Navigate to the dashboard after successful sign in
        } catch (error) {
            console.log('error signing in', error);
            alert('Incorrect username/password'); // Display an error message
        }
    };

    const handleSignupClick = () => {
        navigate("/signup");
    };

    const handleForgotClick = () => {
        navigate("/forgotpassword");
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        handleSignIn(); // Call the handleSignIn function here
    };

    return (
        <div className="login-form">
            <h2 className="login-message">Welcome Back!</h2>
            <form onSubmit={handleSubmit}>
                <label className="login-label" htmlFor="username">Username:</label>
                <input
                    className="login-input"
                    type="text"
                    id='username'
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label className="login-label" htmlFor="password">Password:</label>
                <input
                    className="login-input"
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="login-message" type="button" onClick={handleForgotClick}>Forgot password?</button>
                <button className="login-button" type="submit">Login</button>
                <p className="login-message">Don't have an account?</p>
                <button type="button" className="signup-button" onClick={handleSignupClick}>Sign Up</button>
            </form>
        </div>
    );
}

export default Login;
