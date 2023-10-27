import { useState } from "react";
import Dashboard from "./Dashboard";
import { useNavigate } from "react-router-dom"

function Login() {
    const navigate = useNavigate();
    const [username, setusername] = useState("");
    const [password, setpassword] = useState("");
    const [authenticated, setauthenticated] = useState(localStorage.getItem(localStorage.getItem("authenticated") || false));
    const users = [{ username: "Sarah", password: "testpassword" }];
    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(username);
        console.log(password);
        console.log(users.password);
        if (password === users[0].password) {
            navigate("/dashboard")
        } else {
            console.log("");
        }
    };


    return (
        <div>
            <p>Welcome Back</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    id='username'
                    name="username"
                    value={username}
                    onChange={(e) => setusername(e.target.value)}
                />
                <input
                    type="password"
                    id="password"
                    name="password"
                    onChange={(e) => setpassword(e.target.value)}
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
};

export default Login;
