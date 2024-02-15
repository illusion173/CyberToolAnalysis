import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import Navbar from "./navbar.js";

function UploadTool() {
  const navigate = useNavigate();

  useEffect(() => { }, []);

  return (
    <div className="App">
      <p className="dashboard-welcome">Upload Tool Menu</p>
      <Navbar></Navbar>
    </div>
  );
}

export default UploadTool;
