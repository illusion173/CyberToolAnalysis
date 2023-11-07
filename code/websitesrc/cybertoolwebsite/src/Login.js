import { useState } from "react";
import Dashboard from "./Dashboard";
import Signup from "./Signup";
import { useNavigate } from "react-router-dom"

function Login() {
    const navigate = useNavigate();
    const [username, setusername] = useState("");
    const [password, setpassword] = useState("");
    const [authenticated, setauthenticated] = useState(localStorage.getItem(localStorage.getItem("authenticated") || false));
    const users = [{ username: "Sarah", password: "password" }];
    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(username);
        console.log(password);
        console.log(users.password);
        if (password === users[0].password) {
            navigate("/dashboard")
        } else {
            alert('Incorrect username/password');
            console.log("");
        }
    };

    const handleSignupClick = (e) => {
        navigate("/signup")
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
                    onChange={(e) => setusername(e.target.value)}
                />
                <p>Password:</p>
                <input
                    className="input-field"
                    type="password"
                    id="password"
                    name="password"
                    onChange={(e) => setpassword(e.target.value)}
                />
                <button className="margin-left-login-button" type="submit">Login</button>
                <p>Don't have an account? </p>
                <button onClick={handleSignupClick}>Sign Up</button>
            </form>
        </div>
    )
}

export default Login;
