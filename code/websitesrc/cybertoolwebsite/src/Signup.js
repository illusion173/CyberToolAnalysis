import { useState } from "react";
import Dashboard from "./Dashboard";
import { useNavigate } from "react-router-dom"

function Signup() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');

    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(false);

    // Handling the name change
    const handleName = (e) => {
        setName(e.target.value);
        setSubmitted(false);
    };
 
    // Handling the email change
    const handleEmail = (e) => {
        setEmail(e.target.value);
        setSubmitted(false);
    };
 
    // Handling the password change
    const handlePassword = (e) => {
        setPassword(e.target.value);
        setSubmitted(false);
    };

    // Handling the password change
    const handleRetypePassword = (e) => {
        setRetypePassword(e.target.value);
        setSubmitted(false);
    };
 
    // Handling the form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (name === '' || email === '' || password === '' || retypePassword === '') {
            setError(true);
        } else {
            setSubmitted(true);
            setError(false);
            navigate("/dashboard")
        }
    };
 
    // Showing success message
    const successMessage = () => {
        return (
            <div
                className="success"
                style={{
                    display: submitted ? '' : 'none',
                }}>
                <h1>User {name} successfully registered!!</h1>
            </div>
        );
    };
 
    // Showing error message if error is true
    const errorMessage = () => {
        return (
            <div
                className="error"
                style={{
                    display: error ? '' : 'none',
                }}>
                <h1>Please enter all the fields</h1>
            </div>
        );
    };

    return (
        <div className="form">
            <div>
                <h1>User Registration</h1>
            </div>
 
            {/* Calling to the methods */}
            <div className="messages">
                {errorMessage()}
                {successMessage()}
            </div>
 
            <form>
                {/* Labels and inputs for form data */}
                <label className="label">Name</label>
                <input onChange={handleName} className="input"
                    value={name} type="text" />
 
                <label className="label">Email</label>
                <input onChange={handleEmail} className="input"
                    value={email} type="email" />
 
                <label className="label">Password</label>
                <input onChange={handlePassword} className="input"
                    value={password} type="password" />

                <label className="label">Retype Password</label>
                <input onChange={handleRetypePassword} className="input"
                    value={retypePassword} type="retype password" />
 
                <button onClick={handleSubmit} className="btn"
                        type="submit">
                    Submit
                </button>
            </form>
        </div>
    )
}

export default Signup;