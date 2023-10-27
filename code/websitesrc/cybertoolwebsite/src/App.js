import '@aws-amplify/ui-react/styles.css';
import * as React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import Login from "./Login";
import { CheckboxField } from '@aws-amplify/ui-react';


//button
function clickMe(){
  alert('You pretend signed in');

}

//form-username
function Username_Signin(props){
  return(
    <form className={props.className}>
      <label>Username:
        <input type="text" />
      </label>
    </form>
  )
}

//form-password
function Password_Signin(props){
  return(
    <form className={props.className}>
      <label>Password:
        <input type="text" />
      </label>
    </form>
  )
}


const Checkbox = ({label, value, onChange, className }) => {
  return(
    <label className={className}>
      <input type = "checkbox" checked = {value} onChange = {onChange} />
      {label}
    </label>
  );
};



export default function App() {
  const[checked, setChecked] = React.useState(false);

  const handleChange = () => {
    setChecked(!checked);
  };


  return (
    <div className = "center-container">
      <h1>CyberTools</h1>
      <Login />

      
      {/*
      <Username_Signin className= "margin-bottom"/>
      <Password_Signin className= "margin-bottom" />
      <button onClick = {clickMe} className = "margin-bottom">
        Sign-In
      </button>

      <p> No Account?</p>
      <button onClick = {clickMe}>
        Create an account
      </button>
      <p> or </p>
      <button onClick = {clickMe} className = "margin-bottom">
        Continue as guest
      </button>

     */}
      
    
      <Checkbox
          label = "Do you agree with the Terms or whateva?"
          value = {checked}
          onChange = {handleChange}
          className = "margin-top"
        />
        <p>Is my value checked? {checked.toString()}</p>
    </div>
  );
};




