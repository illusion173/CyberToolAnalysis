import "./ReportList.css";
import React, { useState, useEffect } from "react";
import Navbar from "./navbar.js";
import ReportTable from "./reportTable.js";
const ReportList = () => {
  useEffect(() => { }, []);

  return (
    <div>
      <div></div>
      <h1>Report Menu</h1>
      <Navbar></Navbar>
      <ReportTable></ReportTable>
    </div>
  );
};
export default ReportList;
