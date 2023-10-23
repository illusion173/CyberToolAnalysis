import { Button } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import {
  SignupPage 

 } from './ui-components';


//button
function clickMe(){
  alert('You pretend signed in');
}

//form-username
function Username_Signin(){
  return(
    <form>
      <label>Username:
        <input type="text" />
      </label>
    </form>
  )
}

//form-password
function Password_Signin(){
  return(
    <form>
      <label>Password:
        <input type="text" />
      </label>
    </form>
  )
}


export default function App() {
  return (
    <div>
      <Username_Signin />
      <Password_Signin />
      <button onClick = {clickMe}>
        Sign-In
      </button>
    </div>



  );
}








