import "@aws-amplify/ui-react/styles.css";
import * as React from "react";
import "./App.css";
import Login from "./Login";

const Checkbox = ({ label, value, onChange, className }) => {
  return (
    <label className={className}>
      <input type="checkbox" checked={value} onChange={onChange} />
      {label}
    </label>
  );
};

export default function App() {
  const [checked, setChecked] = React.useState(false);

  const handleChange = () => {
    setChecked(!checked);
  };

  return (
    <div className="center-container">
      <h1>CyberTools</h1>
      <Login />
    </div>
  );
}
