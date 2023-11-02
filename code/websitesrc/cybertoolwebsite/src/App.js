import '@aws-amplify/ui-react/styles.css';
import * as React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import Login from "./Login";
import { CheckboxField } from '@aws-amplify/ui-react';


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
      <Checkbox
        label="Do you agree with the Terms or whateva?"
        value={checked}
        onChange={handleChange}
        className="margin-top"
      />
      <p>Is my value checked? {checked.toString()}</p>
    </div>
  );
};


