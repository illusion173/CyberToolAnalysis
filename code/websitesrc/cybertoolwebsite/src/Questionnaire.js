import "./Questionnaire.css";
import React, { useState } from "react";

import { question_list } from "./questions";
import { useNavigate } from "react-router-dom";
import { fetchJwt, getUserId } from "./helperFunctionsForUserAPI.js";
import { API } from "aws-amplify";

const Questionnaire = () => {
  // Define the state to store user responses
  const [responses, setResponses] = useState({});
  const handleResponseChange = (questionKey, response) => {
    setResponses({ ...responses, [questionKey]: response });
  };

  const getFileNameFromUser = async () => {
    // Display a prompt window asking for a filename
    const fileName = window.prompt("Enter a filename:", "default");

    // Handle the user input (you can perform further actions here)
    if (fileName) {
      alert(`You entered: ${fileName}`);
    } else {
      alert("No filename entered, using default.");
    }

    return fileName;
  };

  const createReportForUser = async () => {
    console.log(responses);
    const jwt = await fetchJwt();
    const username = await getUserId();
    const filename = await getFileNameFromUser();
    try {
      const apiName = "apiab9b8614";
      const path = "/beginCreateReportForUser";
      const headers = {
        Authorization: `Bearer ${jwt}`,
      };

      const requestBody = {
        file_name: `${filename}`,
        user_identifier: `${username}`,
        responses: `${responses}`,
      };

      const myInit = {
        headers,
        body: requestBody,
      };

      let status = await API.post(apiName, path, myInit);
      console.log(status);
    } catch (error) {
      alert(
        "Error while submitting request for report creation. Try again later.",
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Request to create report here
    createReportForUser();
  };

  const navigate = useNavigate();
  const handleDashboardClick = (e) => {
    navigate("/Dashboard");
  };

  const handleReportClick = (e) => {
    navigate("/ReportList");
  };

  const handleSubmitButton = (e) => {
    navigate("/Dashboard")
  }

  const questionElements = question_list.map((question, index) => {
    const questionKey = `question_${index + 1}`;
    return (
      <div key={questionKey}>
        <p>{question[questionKey].Question}</p>
        <ul>
          {question[questionKey]["Answer choices"].map((choice) => {
            const choiceKey = Object.keys(choice)[0];
            return (
              <li key={choiceKey}>
                <label>
                  <input
                    type="radio"
                    name={questionKey}
                    value={choiceKey}
                    onChange={(e) =>
                      handleResponseChange(questionKey, e.target.value)
                    }
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
    <div className="Questionnaire">
      <h1 className="questionnaire-header">Comparative Report Questionnaire</h1>
      <button className="questionnaire-button" onClick={handleDashboardClick}>
        Dashboard
      </button>
      <button className="questionnaire-button" onClick={handleReportClick}>
        Report Menu
      </button>

      <form className="form-padding-style" onSubmit={handleSubmit}>
        {questionElements}
        <button className="submit-button" onClick={handleSubmitButton}>Submit</button>
      </form>
    </div>
  );
};

export default Questionnaire;
