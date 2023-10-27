import { useState } from "react";
import Dashboard from "./Dashboard";

const Login = () => {
    const [username, setusername] = useState("");
    const [password, setpassword] = useState("");
    const [authenticated, setauthenticated] = useState(localStorage.getItem(localStorage.getItem("authenticated") || false));
    const users = [{ username: "Sarah", password: "testpassword"}];
    const handleSubmit = (e) => {
        e.preventDefault()
        const account = users.find((user) => user.username === username);
        if (account && account.password === password) {
            setauthenticated(true)
            localStorage.setItem("authenticated", true);
        }
    };
    return (
        <div>
            <p>Welcome Back</p>
            <form onSubmit = {handleSubmit}>
                <input
                    type = "text"
                    name = "Username"
                    value = {username}
                    onChange = {(e) => setusername(e.target.value)}
                />
                <input  
                    type = "password"
                    name = "Password"
                    onChange={(e) => setpassword(e.target.value)}
                />
                <input type = "submit" value = "Submit" />
            </form>
        </div>
    )
};

export default Login;