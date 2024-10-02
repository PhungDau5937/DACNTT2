import React, { useState } from "react";
import { IoIosAddCircle } from "react-icons/io";
import { MdCancel } from "react-icons/md";

const ShortDocument = ({
  question,
  indexQuestion,
  indexChapter,
  handleChangeQuestion,
  handleChangeOptionsDocQuestion,
  handleCorrectAnswerChangeDoc,
  addOptionsDoc,
  deleteOptionsDoc,
  errorsQuestion,
  questionErrors,
}) => {
  // State for error messages
  const [errors, setErrors] = useState({});

  // Check for duplicate answers within each sub-array
  const checkForDuplicates = (optionsDoc) => {
    const errors = {};

    optionsDoc.forEach((subArray, subArrayIndex) => {
      const cleanedOptions = subArray.map((opt) => opt.trim());
      const seen = new Set();
      const duplicates = {};

      cleanedOptions.forEach((option, index) => {
        if (option === "") {
          return; // Skip empty values
        }
        if (seen.has(option)) {
          duplicates[index] = "Câu trả lời trùng lặp!";
        } else {
          seen.add(option);
        }
      });

      if (Object.keys(duplicates).length > 0) {
        errors[subArrayIndex] = duplicates;
      }
    });

    return errors;
  };

  const handleOptionChange = (e, indexOptionDoc, indexOptionDocChil) => {
    const newValue = e.target.value;
    const newOptionsDoc = question.optionsDoc.map((doc, docIndex) =>
      docIndex === indexOptionDoc
        ? doc.map((opt, optIndex) =>
            optIndex === indexOptionDocChil ? newValue : opt
          )
        : doc
    );

    // Check for duplicates and update errors
    const duplicates = checkForDuplicates(newOptionsDoc);
    setErrors(duplicates);

    handleChangeOptionsDocQuestion(indexChapter, indexQuestion, indexOptionDoc, indexOptionDocChil, newValue);
  };

  // Check current question errors
  const titleQuestionError = questionErrors?.titleQuestion;
  const optionsDocError = questionErrors?.optionsDoc;
  const answerDoc = questionErrors?.answerDoc;

  return (
    <div className="shortDocument">
      {/* Title Question */}
      <div className="relative mb-6">
        <textarea
          id="floating_text"
          name="titleQuestion"
          value={question.titleQuestion}
          onChange={(e) => handleChangeQuestion(indexChapter, indexQuestion, e)}
          className={`block w-full py-2 px-3 text-sm bg-transparent border border-stone-300 rounded-lg dark:text-white dark:border-stone-600 focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
            titleQuestionError ? "border-red-500 border-2" : ""
          }`}
          placeholder=""
        />
        <label
          htmlFor="floating_text"
          className="absolute top-0 left-0 text-sm text-stone-500 dark:text-stone-400 duration-300 transform -translate-y-4 scale-75 origin-top-left peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:translate-y-2 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75"
        >
          Câu hỏi đục lỗ: <span className="text-red-500">*</span>
        </label>
      </div>

      <div className="flex flex-col space-y-4">
        {question.optionsDoc.map((optionDoc, indexOptionDoc) => (
          <div className="flex items-center space-x-2" key={indexOptionDoc}>
            {optionDoc.map((optionDocChil, indexOptionDocChil) => (
              <div key={indexOptionDocChil} className="flex items-center space-x-2">
                {/* Checkbox for correct answer */}
                <input
                  type="radio"
                  id={`ans${indexOptionDocChil}`}
                  name={`correctAnswer-${indexQuestion}`}
                  value={optionDocChil}
                  onChange={(e) =>
                    handleCorrectAnswerChangeDoc(
                      indexChapter,
                      indexQuestion,
                      indexOptionDoc,
                      indexOptionDocChil,
                      e.target.value
                    )
                  }
                  checked={question.answerDoc[indexOptionDoc] === optionDocChil && optionDocChil !== ""}
                  className="w-5 h-5 text-green-600"
                />
                {/* Input Answer */}
                <input
                  type="text"
                  id={`ansShortDoc-${indexChapter}-${indexQuestion}`}
                  value={optionDocChil}
                  onChange={(e) => handleOptionChange(e, indexOptionDoc, indexOptionDocChil)}
                  className={`w-full text-sm bg-transparent border rounded-lg focus:outline-none focus:ring-0 ${
                    errors[indexOptionDoc] && errors[indexOptionDoc][indexOptionDocChil]
                      ? "border-red-500 border-2"
                      : "border-stone-300"
                  } dark:text-white dark:border-stone-600 focus:border-blue-600`}
                  placeholder={`Câu trả lời ${indexOptionDocChil + 1}`}
                  required
                />
                {/* Error Message */}
                {optionDocChil !== "" && errors[indexOptionDoc] && errors[indexOptionDoc][indexOptionDocChil] && (
                  <p className="text-red-500 text-xs">{errors[indexOptionDoc][indexOptionDocChil]}</p>
                )}
              </div>
            ))}
            {/* Button delete answer */}
            <button
              type="button"
              onClick={() => deleteOptionsDoc(indexChapter, indexQuestion, indexOptionDoc)}
              className="text-red-500"
            >
              <MdCancel size={20} />
            </button>
          </div>
        ))}

        {/* Add Option Button */}
        <div className="flex justify-center mt-5">
          <button
            type="button"
            onClick={() => addOptionsDoc(indexChapter, indexQuestion)}
            className="flex items-center justify-center w-10 h-10 bg-stone-100 rounded-full hover:bg-stone-200 focus:outline-none"
          >
            <IoIosAddCircle size={30} className="text-blue-600" />
          </button>
        </div>
      </div>

      <div className="mt-3">
        {optionsDocError && <p className="text-red-500">Vui lòng điền đáp án!</p>}
        {answerDoc && <p className="text-red-500">Vui lòng chọn đáp án đúng!</p>}
      </div>
    </div>
  );
};

export default ShortDocument;
