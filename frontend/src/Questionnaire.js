import "./Questionnaire.css";
import React, { useState } from "react";
import { question_list } from "./questions.js";
import { useNavigate } from "react-router-dom";
import { fetchJwt, getUserId } from "./helperFunctionsForUserAPI.js";
import { API } from "aws-amplify";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Navbar from "./navbar.js";

const Questionnaire = () => {
  const navigate = useNavigate();

  // Define the state to store user responses
  const [responses, setResponses] = useState({});
  const handleResponseChange = (questionKey, response) => {
    setResponses({ ...responses, [questionKey]: response });
  };

  const getFileNameFromUser = async () => {
    // Display a prompt window asking for a filename
    const fileName = window.prompt(
      "Enter a file name for report:",
      "(NotGivenFileName)",
    );

    // Handle the user input (you can perform further actions here)
    if (fileName) {
      alert(`You entered: ${fileName}`);
    } else {
      alert("No filename entered, using default.");
      return "default";
    }

    return fileName;
  };

  const createReportForUser = async () => {
    console.log(responses);
    const jwt = await fetchJwt();
    const username = await getUserId();
    const filename = await getFileNameFromUser();
    try {
      const apiName = "apic25cd3ea";
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
      navigate("/Dashboard");
    } catch (error) {
      alert(
        "Error while submitting request for report creation. Try again later.",
      );
      navigate("/Dashboard");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //Save Responses
    getAnswers();
    // Request to create report here
    createReportForUser();
  };

  const getAnswers = () => {
    const doc = new jsPDF();

    let tableData = [];

    for (const key in responses) {
      const questionObj = question_list.find((question) =>
        key in question ? question : null,
      );

      if (questionObj) {
        const questionText = questionObj[key].Question;
        const answerChoices = questionObj[key]["Answer choices"];
        const selectedAnswer = answerChoices.find(
          (choice) => Object.keys(choice)[0] === responses[key],
        );

        if (selectedAnswer) {
          tableData.push([questionText, Object.values(selectedAnswer)[0]]);
        }
      }
    }

    doc.autoTable({
      head: [["Question", "Response"]],
      body: tableData,
    });

    doc.save("user_responses.pdf");
  };

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
      <Navbar></Navbar>
      <form className="form-padding-style" onSubmit={handleSubmit}>
        {questionElements}
        <span className="pagination">
          <button className="submit-button" onClick={null}>
            Submit Answers
          </button>
        </span>
      </form>
    </div>
  );
};

export default Questionnaire;
