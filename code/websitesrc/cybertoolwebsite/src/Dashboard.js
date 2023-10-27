import {Navigate} from "react-router-dom"
import { useEffect, useState } from "react";

const Dashboard = () => {
    const[authenticated, setauthenticated] = useState(null);
    useEffect(() => {
        const loggedInUser = localStorage.getItem("authenticated");
        if (loggedInUser){
            setauthenticated(loggedInUser);
        }
    } , []);

    if (!authenticated){
        return <Navigate replace to = "/login" />;
    }else{
        return(
            <div>
                <p>Welcome to your Dashboard!</p>
            </div>
        );
    }

};
export default Dashboard;

