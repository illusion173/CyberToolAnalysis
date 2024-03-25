import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import Navbar from "./navbar.js";
import UploadToolTable from "./uploadToolTableComponent.js";
function UploadTool() {
  const navigate = useNavigate();

  useEffect(() => { }, []);

  return (
    <div className="App">
      <p className="dashboard-welcome">Pending Tool Menu</p>
      <Navbar></Navbar>
      <UploadToolTable></UploadToolTable>
    </div>
  );
}

export default UploadTool;
