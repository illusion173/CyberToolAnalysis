
import { useState } from "react";
import Dashboard from "./Dashboard";
import Signup from "./Signup";
import { useNavigate } from "react-router-dom";
import { Auth } from 'aws-amplify'; // Make sure to import Auth from AWS Amplify

////////////////////////////////////////////////////////////////
import awsExports from "./aws-exports";
import {Amplify} from 'aws-amplify'

Amplify.configure(awsExports);

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState(""); // Changed to setUsername for consistency
    const [password, setPassword] = useState(""); // Changed to setPassword for consistency

    // This function will be called when the user submits the form
    const signIn = async () => {
        try {
            const user = await Auth.signIn(username, password);
            console.log(user); // You can remove this after confirming it works
            // Set authenticated in localStorage or manage the state as needed
            localStorage.setItem("authenticated", true);
            navigate("/dashboard"); // Navigate to the dashboard after successful sign in
        } catch (error) {
            console.log('error signing in', error);
            alert('Incorrect username/password'); // Display an error message
        }
    };

    const handleSignupClick = (e) => {
        navigate("/signup")
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        signIn(); // Call the signIn function here
    };

  
    return (
        <div>
            <p className="margin-left-Welcome">Welcome Back</p>
            <p> Username:</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    id='username'
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} // Use setUsername here
                />
                <p>Password:</p>
                <input
                    className="input-field"
                    type="password"
                    id="password"
                    name="password"
                    value={password} // Add value attribute to control the input
                    onChange={(e) => setPassword(e.target.value)} // Use setPassword here
                />
                <button className="margin-left-login-button" type="submit">Login</button>
                <p>Don't have an account? </p>
                <button onClick={handleSignupClick}>Sign Up</button>
            </form>
        </div>
    )
}

export default Login;

