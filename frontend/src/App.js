import "@aws-amplify/ui-react/styles.css";
import * as React from "react";
import "./App.css";
import Login from "./Login";

export default function App() {
  return (
    <div className="center-container">
      <h1>CyberTools</h1>
      <Login />
    </div>
  );
}
