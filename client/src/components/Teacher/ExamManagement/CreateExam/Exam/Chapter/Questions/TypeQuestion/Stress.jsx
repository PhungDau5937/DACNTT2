import React, { useRef, useState, useEffect } from "react";
import { TbBrush, TbBrushOff } from "react-icons/tb";

const Stress = ({
  question,
  indexChapter,
  indexQuestion,
  handleCorrectAnswerChange,
  handleChangeOptionsQuestion,
  errorsQuestion, // Added prop for errors
  questionErrors, // Added prop for question-specific errors
}) => {
  // State for error messages
  const [errors, setErrors] = useState({});

  // Initialize useRef for answer inputs
  const answerRefs = useRef([]);

  // Function to initialize answerRefs with empty refs
  const initializeRefs = () => {
    answerRefs.current = question.options.map((_, i) => answerRefs.current[i] || React.createRef());
  };

  // Remove <u> tags
  const removeUTags = (text) => {
    return text.replace(/<\/?u>/g, '');
  };

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

  // Check for duplicates and empty fields
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

  const checkForEmptyFields = (options) => {
    const emptyFields = {};
    options.forEach((option, index) => {
      if (!removeUTags(option).trim()) {
        emptyFields[index] = "Câu trả lời không được bỏ trống!";
      }
    });
    return emptyFields;
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

    // Check for duplicates and empty fields, and update errors
    const duplicates = checkForDuplicates(newOptions);
    const emptyFields = checkForEmptyFields(newOptions);

    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      // Remove errors for options that are no longer duplicates or empty
      Object.keys(updatedErrors).forEach((key) => {
        if (!newOptions.some((opt, index) => index === key && !duplicates[index] && !emptyFields[index])) {
          delete updatedErrors[key];
        }
      });
      // Add errors for new duplicates or empty fields
      return { ...updatedErrors, ...duplicates, ...emptyFields };
    });
  };

  // Effect to handle external errors
  useEffect(() => {
    if (errorsQuestion) {
      const chapterErrors = errorsQuestion.questions
        .find((q) => q.chapterID === indexChapter)
        ?.questions.find((q) => q.questionID === indexQuestion)?.errors;

      if (chapterErrors) {
        setErrors((prevErrors) => {
          const updatedErrors = { ...prevErrors };
          const errorIndices = chapterErrors.optionsValues || [];
          return question.options.reduce((acc, _, index) => {
            if (errorIndices.includes(index)) {
              acc[index] = "Câu trả lời không hợp lệ!";
            }
            return acc;
          }, updatedErrors);
        });
      }
    }
  }, [errorsQuestion, indexChapter, indexQuestion, question.options]);

  // Initialize refs on question options change
  useEffect(() => {
    initializeRefs();
  }, [question.options]);

  return (
    <div>
      {/* Title Question */}
      <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-200 mb-4">
        Câu hỏi đánh trọng âm
      </h2>

      <div className="space-y-2">
        {question.options.map((option, indexOption) => (
          <div key={indexOption} className="flex items-center space-x-2">
            {/* Checkbox for correct answer */}
            <input
              type="radio"
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
              className="w-5 h-5 text-green-600"
              checked={question.answer === removeUTags(option) && option.trim() !== ""}
              aria-label={`Select if this is the correct answer for option ${indexOption + 1}`}
            />

            {/* Input Answer */}
            <input
              type="text"
              id={`ans${indexOption}`}
              ref={answerRefs.current[indexOption]}
              value={removeUTags(option)} // Remove tags for display
              onChange={(e) => handleOptionChange(e, indexOption)}
              className={`w-3/4 p-1 text-sm text-stone-900 bg-transparent rounded-lg border focus:border-blue-600 dark:text-white dark:border-stone-600 dark:focus:border-blue-500 ${errors[indexOption] ? 'border-red-500 dark:border-red-500' : 'border-stone-300'} focus:outline-none peer pl-2`}
              placeholder={`Câu trả lời ${indexOption + 1}`}
              required
              aria-label={`Answer option ${indexOption + 1}`}
            />

            {/* Display Option Text */}
            <p
              dangerouslySetInnerHTML={{ __html: option }}
              className="text-sm text-stone-800 dark:text-stone-300 mx-4"
            />

            {/* Buttons for Formatting */}
            <div className="flex items-center space-x-2 ml-4">
              <button
                type="button"
                onClick={() =>
                  handleUnderlineSelectedText(indexQuestion, indexOption)
                }
                className="p-2 bg-stone-200 rounded hover:bg-stone-300 dark:bg-stone-700 dark:hover:bg-stone-600"
                aria-label="Underline text"
              >
                <TbBrush size={20} />
              </button>

              <button
                type="button"
                onClick={() => handleClearUnderline(indexQuestion, indexOption)}
                className="p-2 bg-stone-200 rounded hover:bg-stone-300 dark:bg-stone-700 dark:hover:bg-stone-600"
                aria-label="Clear underline"
              >
                <TbBrushOff size={20} />
              </button>
            </div>

            

            {/* Error Message */}
            {errors[indexOption] && (
              <p className=" text-red-500 dark:text-red-500 text-xs ml-2">{errors[indexOption]}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4">
        {questionErrors?.answer && (
          <p className="text-red-500 dark:text-red-500 text-sm">
            Vui lòng chọn đáp án đúng!
          </p>
        )}
      </div>
    </div>
  );
};

export default Stress;
