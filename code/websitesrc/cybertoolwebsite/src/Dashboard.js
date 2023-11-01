import { useNavigate } from "react-router-dom"

function Dashboard() {
    const navigate = useNavigate();
    const handleReportListClick = (e) => {
        navigate("/reportlist")
    }


    return (
        <div>
            <p>Welcome to your Dashboard!</p>
            <button onClick={handleReportListClick}>Report List</button>
        </div >
    );
};
export default Dashboard;
