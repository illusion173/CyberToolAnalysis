import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Signup.css';
import { Auth } from 'aws-amplify';

function Signup() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');
    const [confirmationCode, setConfirmationCode] = useState('');

    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);

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

    // Handling the retype password change
    const handleRetypePassword = (e) => {
        setRetypePassword(e.target.value);
        setSubmitted(false);
    };

    // Handling the confirmation code change
    const handleConfirmationCode = (e) => {
        setConfirmationCode(e.target.value);
    };

    // Handling the form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (name === '' || email === '' || password === '' || retypePassword === '') {
            setError(true);
        } else {
            try {
                await Auth.signUp({
                    username: email,
                    password: password,
                    attributes: {
                        email: email,
                        // other attributes can be added here
                    }
                });
                setIsConfirming(true);
                setSubmitted(true);
                setError(false);
            } catch (error) {
                console.error('Error during sign up:', error);
                setError(true);
            }
        }
    };

    // Confirm sign up
    async function confirmSignUp() {
        try {
            await Auth.confirmSignUp(email, confirmationCode);
            navigate("/dashboard");
        } catch (error) {
            console.error('Error confirming sign up', error);
        }
    }

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
                    value={retypePassword} type="password" />

                <button onClick={handleSubmit} className="btn"
                        type="submit">
                    Submit
                </button>
            </form>

            {isConfirming && (
                <div>
                    <label className="label">Confirmation Code</label>
                    <input onChange={handleConfirmationCode} className="input"
                        value={confirmationCode} type="text" />
                    <button onClick={confirmSignUp} className="btn">Confirm Sign Up</button>
                </div>
            )}
        </div>
    );
}

export default Signup;
