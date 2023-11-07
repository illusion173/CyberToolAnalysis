import "./Questionnaire.css"
import React, { useState } from 'react';
import { question_list } from "./questions";
import { useNavigate } from "react-router-dom";
import { Auth } from 'aws-amplify';

//const user = await Auth.currentAuthenticatedUser();
//const { attributes } = user;

const Questionnaire = () => {
  // Define the state to store user responses
  const [responses, setResponses] = useState({});
  const handleResponseChange = (questionKey, response) => {
    setResponses({ ...responses, [questionKey]: response });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can access the user's responses in the 'responses' state and perform actions like sending the data to a server or displaying it.
    //console.log(attributes);
  };

  const navigate = useNavigate();
  const handleDashboardClick = (e) => {
    navigate("/Dashboard")
  }

  const handleReportClick = (e) => {
    navigate("/ReportList")
  }

  const questionElements = question_list.map((question, index) => {
    const questionKey = `Question ${index + 1}`;
    return (
      <div key={questionKey}>
        <p>{question[questionKey].Question}</p>
        <ul>
          {question[questionKey]['Answer choices'].map((choice) => {
            const choiceKey = Object.keys(choice)[0];
            return (
              <li key={choiceKey}>
                <label>
                  <input
                    type="radio"
                    name={questionKey}
                    value={choiceKey}
                    onChange={(e) => handleResponseChange(questionKey, e.target.value)}
                    checked={responses[questionKey] === choiceKey}
                  />
                  {choice[choiceKey]}
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    );
  });

  return (
    <div>
      <h1>Comparative Report Questionnaire</h1>
      <button onClick={handleDashboardClick}>Dashboard</button>
      <button onClick={handleReportClick}>Report Menu</button>

      <form className="form-padding-style" onSubmit={handleSubmit}>
        {questionElements}
        <button type="submit">Submit</button>
      </form>
    </div>
  );

}

export default Questionnaire;
