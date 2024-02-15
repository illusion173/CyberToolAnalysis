import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Reportlist from "./ReportList";
import Questionnaire from "./Questionnaire";
import Signup from "./Signup";
import UploadTool from "./UploadTool";
import ForgotPassword from "./ForgotPassword";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  //<React.StrictMode>
  <BrowserRouter>
    <Routes>
      <Route index element={<App />} />
      <Route path="login" element={<Login />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="reportlist" element={<Reportlist />} />
      <Route path="questionnaire" element={<Questionnaire />} />
      <Route path="signup" element={<Signup />} />
      <Route path="forgotpassword" element={<ForgotPassword />} />
      <Route path="uploadtool" element={<UploadTool />} />
    </Routes>
  </BrowserRouter>,
  //</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
