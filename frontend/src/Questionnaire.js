import "./Questionnaire.css";
import React, { useState } from "react";
import {
  question_list,
  tool_function_categories_cleaner_dict,
  question_list_converter_dict,
} from "./questions.js";
import { useNavigate } from "react-router-dom";
import { createReportForUser } from "./questionnaireHelperAPI.js";
const Questionnaire = () => {
  const navigate = useNavigate();

  // Define the state to store user responses
  const [budget, setBudget] = useState(0);
  const [responses, setResponses] = useState({});
  const [description, setDescription] = useState("");

  // Function to render the character count indicator
  const renderCharacterCount = () => {
    const remaining = 1000 - description.length;
    return `Characters left: ${remaining}`;
  };

  const handleResponseChange = (questionKey, response, isCheckbox = false) => {
    if (isCheckbox) {
      // For checkboxes, we need to handle multiple selections
      const currentResponses = responses[questionKey]
        ? [...responses[questionKey]]
        : [];
      if (currentResponses.includes(response)) {
        // If the response is already in the array, remove it (the user is unchecking the box)
        setResponses({
          ...responses,
          [questionKey]: currentResponses.filter((res) => res !== response),
        });
      } else {
        // Add the newly checked response
        setResponses({
          ...responses,
          [questionKey]: [...currentResponses, response],
        });
      }
    } else {
      // For all other inputs, just set the response directly
      setResponses({ ...responses, [questionKey]: response });
    }
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

  const prepare_data_form = (user_responses) => {
    let fullTextResponses = {};

    // Iterate over each response
    for (const [questionKey, responseValue] of Object.entries(user_responses)) {
      const questionIndex = parseInt(questionKey.split("_")[1]) - 1; // Convert question_X to an index
      const questionData = question_list[questionIndex][questionKey];

      if (Array.isArray(responseValue)) {
        // Handle multiple selections (for checkboxes)
        fullTextResponses[questionKey] = responseValue.map(
          (letter) =>
            questionData["Answer choices"].find((choice) => choice[letter])[
            letter
            ],
        );
      } else {
        // Handle single selections (for radio buttons and dropdowns)
        if (questionIndex === 0) {
          // Special case for question 1 with dropdown
          // Directly use the responseValue since it's already what the user has selected
          //
          let new_responsevalue =
            tool_function_categories_cleaner_dict[responseValue];
          fullTextResponses[questionKey] = new_responsevalue;
        } else {
          // For radio button questions
          fullTextResponses[questionKey] = questionData["Answer choices"].find(
            (choice) => choice[responseValue],
          )[responseValue];
        }
      }
    }
    return fullTextResponses;
  };
  const convertQuestionKeys = (originalJson) => {
    const convertedObject = {};
    Object.keys(originalJson).forEach((key) => {
      const newKey = question_list_converter_dict[key];
      convertedObject[newKey] = originalJson[key];
    });
    return convertedObject;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    let file_name = await getFileNameFromUser();

    // redo the values here
    let corrected_user_responses = prepare_data_form(responses);
    console.log(corrected_user_responses);
    let corrected_keys = convertQuestionKeys(corrected_user_responses);
    corrected_keys["free_response"] = description;
    corrected_keys["budget_constraints"] = parseInt(budget);
    let report_status = await createReportForUser(corrected_keys, file_name);
  };

  const handleDashboardClick = (e) => {
    navigate("/Dashboard");
  };

  const handleReportClick = (e) => {
    navigate("/ReportList");
  };

  const questionElements = question_list.map((question, index) => {
    const questionKey = `question_${index + 1}`;
    if (index === 0) {
      // Check if it's the first question
      return (
        <div key={questionKey}>
          <p>{question[questionKey].Question}</p>
          <select
            onChange={(e) => handleResponseChange(questionKey, e.target.value)}
            value={responses[questionKey] || ""}
          >
            {question[questionKey]["Answer choices"].map((choice) => {
              return (
                <option key={choice} value={choice}>
                  {choice}
                </option>
              );
            })}
          </select>
        </div>
      );
    } else if (index === 1) {
      return (
        <div key={questionKey}>
          <p>{question[questionKey].Question}</p>
          <ul>
            {question[questionKey]["Answer choices"].map(
              (choice, choiceIndex) => {
                const choiceKey = Object.keys(choice)[0];
                return (
                  <li key={choiceKey}>
                    <label>
                      <input
                        type="checkbox"
                        name={questionKey}
                        value={choiceKey}
                        onChange={(e) =>
                          handleResponseChange(
                            questionKey,
                            e.target.value,
                            true,
                          )
                        }
                        checked={responses[questionKey]?.includes(choiceKey)}
                      />
                      {choice[choiceKey]}
                    </label>
                  </li>
                );
              },
            )}
          </ul>
        </div>
      );
    } else {
      // Render as before for other questions
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
    }
  });

  return (
    <div className="Questionnaire">
      <h1 className="questionnaire-header">Comparative Report Questionnaire</h1>
      <span className="pagination">
        <button className="questionnaire-button" onClick={handleDashboardClick}>
          Dashboard
        </button>
        <button className="questionnaire-button" onClick={handleReportClick}>
          Report Menu
        </button>
      </span>

      <form className="form-padding-style" onSubmit={handleSubmit}>
        {questionElements}
        <div className="form-group">
          {" "}
          <label>
            {" "}
            What budget constraints or limitations do you have when it comes to
            investing in cybersecurity technologies for the aerospace industry?
            <input
              type="number"
              placeholder="Enter a $ dollar amount"
              onChange={(e) => setBudget(e.target.value)}
            ></input>
          </label>
        </div>
        <div className="form-group">
          <label className="form-group-label">
            Description
            <div className="textarea-description">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you need in plain English.  (max 1000 characters)"
                maxLength="1000" // Set maximum length
                rows="5" // Set initial visible rows
                className="textarea-box"
              ></textarea>
            </div>
          </label>
          <div className="character-count">{renderCharacterCount()}</div>
        </div>
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
