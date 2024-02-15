import { useNavigate } from "react-router-dom";
import "./navbar.css";
function Navbar() {
  const navigate = useNavigate();

  // NAVIGATION TO DIFFERENT PAGES
  const handleQuestionnaireClick = (e) => {
    navigate("/Questionnaire");
  };

  const handleReportListClick = (e) => {
    navigate("/ReportList");
  };

  const handleUploadToolClick = () => {
    navigate("/UploadTool");
  };

  const handleDashboardClick = () => {
    navigate("/Dashboard");
  };

  return (
    <div>
      <span>
        <div>
          <button className="navbar-button" onClick={handleDashboardClick}>
            Dashboard
          </button>
          <button className="navbar-button" onClick={handleReportListClick}>
            Report Menu
          </button>
          <button className="navbar-button" onClick={handleQuestionnaireClick}>
            Questionnaire
          </button>
          <button className="navbar-button" onClick={handleUploadToolClick}>
            Upload Tool
          </button>
        </div>
      </span>
    </div>
  );
}

export default Navbar;
