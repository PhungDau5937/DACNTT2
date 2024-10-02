import React, { useState, useEffect } from "react";

const ShortAnswer = ({
  question,
  indexQuestion,
  indexChapter,
  handleChangeQuestion,
  errorsQuestion,
  questionErrors,
}) => {
  // Trạng thái lưu trữ thông báo lỗi
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (errorsQuestion) {
      // Tìm lỗi của câu hỏi hiện tại trong dữ liệu lỗi
      const chapterErrors = errorsQuestion.questions
        .find((q) => q.chapterID === indexChapter)
        ?.questions.find((q) => q.questionID === indexQuestion)?.errors;

      if (chapterErrors) {
        setErrors((prevErrors) => {
          const updatedErrors = { ...prevErrors };
          // Kiểm tra lỗi cụ thể cho câu trả lời ngắn nếu có
          if (chapterErrors.answer) {
            updatedErrors.answer = chapterErrors.answer;
          }
          return updatedErrors;
        });
      }
    }
  }, [errorsQuestion, indexChapter, indexQuestion]);

  const handleAnswerChange = (e) => {
    // Cập nhật lỗi nếu cần
    setErrors((prevErrors) => ({
      ...prevErrors,
      answer: "", // Xóa lỗi hiện tại khi có sự thay đổi
    }));

    handleChangeQuestion(indexChapter, indexQuestion, e);
  };

  // Kiểm tra lỗi của câu hỏi hiện tại
  const answerError = questionErrors?.answer;
  const titleQuestionError = questionErrors?.titleQuestion;

  return (
    <div className="">
      {/* Tiêu đề câu hỏi */}
      <div className="relative mb-6">
        <textarea
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
          Câu hỏi ngắn: <span className="text-red-500">*</span>
        </label>
      </div>

      <div className="space-y-4">
        {/* Input Answer */}
        <input
          type="text"
          id="AnsCorect"
          name="answer"
          value={question.answer}
          onChange={handleAnswerChange}
          className={`w-full text-xs dark:text-white py-2 px-4 bg-transparent border rounded-lg focus:outline-none ${
            errors.answer ? "border-red-500" : "border-stone-300"
          } dark:border-stone-600 dark:focus:border-blue-500`}
          placeholder="Câu trả lời ngắn"
          required
        />
        {/* Thông báo lỗi */}
        {errors.answer && (
          <p className="text-red-500 text-xs">{errors.answer}</p>
        )}
      </div>

      <div className="mt-3">
        {answerError && <p className="text-red-500 text-xs">Vui lòng nhập câu trả lời!</p>}
      </div>
    </div>
  );
};

export default ShortAnswer;
