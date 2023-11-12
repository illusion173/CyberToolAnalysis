
import { useState } from "react";
import Dashboard from "./Dashboard";
import Signup from "./Signup";
import { useNavigate } from "react-router-dom";
import { Auth } from 'aws-amplify'; // Make sure to import Auth from AWS Amplify


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
            // localStorage.setItem("authenticated", true); <- This not needed
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
        <div className = "login-form">
            <h2 className = "login-message"> Welcome Back!</h2>
            <form onSubmit = {handleSubmit}>
                <label className = "login-label" htmlFor = "username"> Username: </label>
                <input
                    className = "login-input"
                    type="text"
                    id='username'
                    name= "username"
                    value = {username}
                    onChange={(e) => setUsername (e.target.value)}
                 />
                 <lable clasName = "login-label" htmlFor="password" >Password:</lable>
                 <input
                    className = "login-input"
                    type = "password"
                    id = "password"
                    name = "password"
                    value = {password}
                    onChange = {(e) => setPassword(e.target.value)}
                />
                <button className = "login-button" type = "submit" >Login</button>
                <p clasName = "login-message">Don't have an account?</p>
                <button type = "button" className = "signup-button" onClick = {handleSignupClick} >Sign Up</button>
            </form>
        </div>
    
    );
}

export default Login;

