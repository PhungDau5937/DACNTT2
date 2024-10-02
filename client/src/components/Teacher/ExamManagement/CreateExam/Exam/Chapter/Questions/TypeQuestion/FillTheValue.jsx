import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux"; 

const FillTheValue = ({
  question,
  indexQuestion,
  indexChapter,
  handleChangeQuestion,
  handleCorrectAnswerChange,
  handleChangeOptionsQuestion,
  errorsQuestion,
  questionErrors,
}) => {
  // Trạng thái lưu trữ thông báo lỗi
  const [errors, setErrors] = useState({});
  const language = useSelector((state) => state.language.language); 

  useEffect(() => {
    if (errorsQuestion) {
      // Tìm lỗi của câu hỏi hiện tại trong dữ liệu lỗi
      const chapterErrors = errorsQuestion.questions
        .find((q) => q.chapterID === indexChapter)
        ?.questions.find((q) => q.questionID === indexQuestion)?.errors;

      if (chapterErrors) {
        setErrors((prevErrors) => {
          const updatedErrors = { ...prevErrors };
          // Lấy chỉ mục lỗi từ optionsValues
          const errorIndices = chapterErrors.optionsValues || [];
          return question.options.reduce((acc, _, index) => {
            if (errorIndices.includes(index)) {
              acc[index] = language === 'vi' ? "Câu trả lời không hợp lệ!" : "Invalid answer!";
            }
            return acc;
          }, updatedErrors);
        });
      }
    }
  }, [errorsQuestion, indexChapter, indexQuestion, question.options, language]);

  // Kiểm tra các câu trả lời bị trùng lặp
  const checkForDuplicates = (options) => {
    const cleanedOptions = options.map((opt) => opt.trim());
    const seen = new Set();
    const duplicates = {};

    cleanedOptions.forEach((option, index) => {
      if (option && seen.has(option)) {
        duplicates[index] = language === 'vi' ? "Câu trả lời trùng lặp!" : "Duplicate answer!";
      } else {
        seen.add(option);
      }
    });

    return duplicates;
  };

  // Kiểm tra các ô nhập không được bỏ trống
  const checkForEmptyFields = (options) => {
    const emptyFields = {};
    options.forEach((option, index) => {
      if (!option.trim()) {
        emptyFields[index] = language === 'vi' ? "Câu trả lời không được bỏ trống!" : "Answer cannot be empty!";
      }
    });
    return emptyFields;
  };

  const handleOptionChange = (e, indexOption) => {
    const newOption = e.target.value;
    const newOptions = question.options.map((opt, i) =>
      i === indexOption ? newOption : opt
    );

    // Kiểm tra lỗi trùng lặp và lỗi ô nhập không được bỏ trống
    const duplicates = checkForDuplicates(newOptions);
    const emptyFields = checkForEmptyFields(newOptions);

    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      // Xóa lỗi cho các tùy chọn không còn trùng lặp hoặc không còn bỏ trống
      Object.keys(updatedErrors).forEach((key) => {
        if (
          !newOptions.some(
            (opt, index) =>
              index === key && !duplicates[index] && !emptyFields[index]
          )
        ) {
          delete updatedErrors[key];
        }
      });
      // Thêm lỗi cho các tùy chọn mới bị trùng lặp hoặc bị bỏ trống
      return { ...updatedErrors, ...duplicates, ...emptyFields };
    });

    handleChangeOptionsQuestion(indexChapter, indexQuestion, {
      ...question,
      options: newOptions,
    });
  };

  console.log("errors: ", errors);

  // Kiểm tra lỗi của câu hỏi hiện tại
  const answerError = questionErrors?.answer;
  const titleQuestionError = questionErrors?.titleQuestion;

  return (
    <div className="">
      {/* Tiêu đề câu hỏi */}
      <div className="relative mb-6">
        <textarea
          type="text"
          id="floating_text"
          name="titleQuestion"
          value={question.titleQuestion}
          onChange={(e) => handleChangeQuestion(indexChapter, indexQuestion, e)}
          className={`block w-full text-xs py-2 px-4 dark:text-white bg-transparent border border-stone-300 rounded-lg focus:outline-none focus:border-blue-500 dark:border-stone-600 dark:focus:border-blue-500 ${
            titleQuestionError ? "border-red-500 dark:border-red-500" : ""
          }`}
          placeholder=""
        />
        <label
          htmlFor="floating_text"
          className="absolute top-0 left-0 text-xs text-stone-500 dark:text-stone-400 transform -translate-y-4 scale-75 origin-top-left transition-all duration-300 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:translate-y-2 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75"
        >
          {language === 'vi' ? 'Câu hỏi điền khuyết:' : 'Fill-in-the-blank question:'} <span className="text-red-500 dark:text-red-500">*</span>
        </label>
      </div>

      <div className="space-y-4">
        {question.options.map((option, indexOption) => (
          <div key={indexOption} className="flex items-center space-x-3">
            {/* Checkbox cho câu trả lời đúng */}
            <input
              type="radio"
              id={`correctAnswer-${indexOption}`}
              name={`correctAnswer-${indexQuestion}`}
              value={option}
              onChange={(e) =>
                handleCorrectAnswerChange(indexChapter, indexQuestion, e.target.value)
              }
              className="w-5 h-5 text-green-600 rounded border-stone-300 dark:border-stone-600 dark:bg-stone-700"
              checked={question.answer === option && option.trim() !== ""}
            />
            {/* Ô nhập câu trả lời */}
            <input
              type="text"
              id={`ans${indexOption}`}
              value={option}
              onChange={(e) => handleOptionChange(e, indexOption)}
              className={`w-full text-xs dark:text-white py-2 px-4 bg-transparent border  rounded-lg focus:outline-none ${
                errors[indexOption] ? "border-red-500 dark:border-red-500" : "border-stone-300"
              } dark:border-stone-600 dark:focus:border-blue-500`}
              placeholder={`${language === 'vi' ? `Câu trả lời ${indexOption + 1}` : `Answer ${indexOption + 1}`}`}
              required
            />
            {/* Thông báo lỗi */}
            {errors[indexOption] && option.trim() !== "" && (
              <p className="text-red-500 text-xs ">{errors[indexOption]}</p>
            )}
          </div>
        ))}
      </div>

      {answerError && (
        <p className="text-red-500 text-xs mt-3">
          {language === 'vi' ? 'Vui lòng chọn đáp án đúng!' : 'Please select a correct answer!'}
        </p>
      )}
    </div>
  );
};

export default FillTheValue;
