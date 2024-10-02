/* eslint-disable react-hooks/rules-of-hooks */
import React, { useRef, useState } from "react";
import { RiFormatClear } from "react-icons/ri";
import { FaUnderline } from "react-icons/fa6";

const Stress = ({
  question,
  indexChapter,
  indexQuestion,
  handleCorrectAnswerChange,
  handleChangeOptionsQuestion,
}) => {
  // State for error messages
  const [errors, setErrors] = useState({});

  // Remove <u> tags
  const removeUTags = (text) => {
    return text.replace(/<\/?u>/g, '');
  }

  // Initialize useRef outside callback
  const answerRefs = useRef(question.options.map(() => useRef(null)));

  // Handle underlining selected text
  const handleUnderlineSelectedText = (indexQuestion, indexOption) => {
    const input = answerRefs.current[indexOption].current;
    if (input) {
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const text = input.value;

      if (start !== end) {
        const underlinedText = `${text.slice(0, start)}<u>${text.slice(start, end)}</u>${text.slice(end)}`;
        const newOptions = question.options.map((opt, i) =>
          i === indexOption ? underlinedText : opt
        );

        handleChangeOptionsQuestion(indexChapter, indexQuestion, {
          ...question,
          options: newOptions,
        });
      }
    }
  };

  // Clear underline from text
  const handleClearUnderline = (indexQuestion, indexOption) => {
    const newOptions = question.options.map((opt, z) =>
      z === indexOption ? removeUTags(opt) : opt
    );
    handleChangeOptionsQuestion(indexChapter, indexQuestion, {
      ...question,
      options: newOptions,
    });
  };

  // Check for duplicate answers
  const checkForDuplicates = (options) => {
    const cleanedOptions = options.map(removeUTags);
    const seen = new Set();
    const duplicates = {};

    cleanedOptions.forEach((option, index) => {
      if (seen.has(option)) {
        duplicates[index] = "Câu trả lời trùng lặp!";
      } else {
        seen.add(option);
      }
    });

    return duplicates;
  };

  const handleOptionChange = (e, indexOption) => {
    const newOption = e.target.value;
    const newOptions = question.options.map((opt, i) =>
      i === indexOption ? newOption : opt
    );

    // Update the options
    handleChangeOptionsQuestion(indexChapter, indexQuestion, {
      ...question,
      options: newOptions,
    });

    // Check for duplicates and update errors
    const duplicates = checkForDuplicates(newOptions);

    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      // Remove errors for options that are no longer duplicates
      Object.keys(updatedErrors).forEach((key) => {
        if (!newOptions.some((opt, index) => index === key && !duplicates[index])) {
          delete updatedErrors[key];
        }
      });
      // Add errors for new duplicates
      return { ...updatedErrors, ...duplicates };
    });
  };

  return (
    <div className="stress">
      {/* Title Question */}
      <h2 className="mb-2 text-sm font-bold">Câu hỏi đánh trọng âm</h2>

      <div>
        {question.options.map((option, indexOption) => (
          <div key={indexOption} className="flex items-center pt-2">
            {/* Radio answer correct */}
            <input
              type="checkbox"
              id={`correctAnswer-${indexOption}`}
              name={`correctAnswer-${indexOption}`}
              value={removeUTags(option)}
              onChange={(e) =>
                handleCorrectAnswerChange(
                  indexChapter,
                  indexQuestion,
                  e.target.value
                )
              }
              className="mr-3 w-5 h-5 text-green-600 mt-1"
              checked={question.answer === removeUTags(option)}
            />

            
            {/* Input Answer */}
            <input
              type="text"
              id={`ans${indexOption}`}
              ref={answerRefs.current[indexOption]}
              value={removeUTags(option)} // Remove tags for display
              onChange={(e) => handleOptionChange(e, indexOption)}
              className={`w-[30%] text-sm text-gray-900 bg-transparent border-0 border-b-2 ${errors[indexOption] ? 'border-red-500' : 'border-gray-300'} appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer pl-2`}
              placeholder={`Câu trả lời ${indexOption + 1}`}
              required
              aria-label={`Answer option ${indexOption + 1}`}
            />

            {/* Button Underline */}
            <div className="button flex items-center justify-center gap-2 ml-5">
              <button
                type="button"
                onClick={() =>
                  handleUnderlineSelectedText(indexQuestion, indexOption)
                }
                aria-label="Underline text"
              >
                <FaUnderline size={25} />
              </button>

              {/* Button clear Underline */}
              <button
                type="button"
                onClick={() => handleClearUnderline(indexQuestion, indexOption)}
                aria-label="Clear underline"
              >
                <RiFormatClear size={30} />
              </button>

              <p
                dangerouslySetInnerHTML={{ __html: option }}
                className="mx-5 text-xl"
              />
            </div>

            {/* Error Message */}
            {errors[indexOption] && (
              <p className="text-red-500 ml-2">{errors[indexOption]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stress;
