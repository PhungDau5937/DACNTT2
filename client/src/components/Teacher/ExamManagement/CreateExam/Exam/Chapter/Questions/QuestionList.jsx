import React from "react";
import { IoMdCopy } from "react-icons/io";
import { BsTrash3Fill } from "react-icons/bs";
import Mulchoise from "./TypeQuestion/Mulchoise";
import FillTheValue from "./TypeQuestion/FillTheValue";
import ShortDocument from "./TypeQuestion/ShortDocument";
import Listenning from "./TypeQuestion/Listenning";
import Stress from "./TypeQuestion/Stress";
import ShortAnswer from "./TypeQuestion/ShortAnswer";

const QuestionList = ({
  chapter,
  question,
  handleSelectTypeQuestion,
  handleCorrectAnswerChange,
  handleChangeOptionsQuestion,
  handleCorrectAnswerChangeDoc,
  handleChangeOptionsDocQuestion,
  addQuestion,
  deleteQuestion,
  indexChapter,
  indexQuestion,
  handleChangeQuestion,
  getLevel,
  onDragStart,
  onDrop,
  onDragOver,
  addAnswer,
  addOptionsDoc,
  deleteOptionsDoc,
  errorsQuestion,
}) => {
  const questionErrors = errorsQuestion?.questions
    .find((chap) => chap.chapterID === chapter.chapterID)
    ?.questions.find((q) => q.questionID === question.questionID)?.errors;

  const language = localStorage.getItem("language");
  const typeError = questionErrors?.type;
  const levelError = questionErrors?.level;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, indexQuestion, indexChapter)}
      onDrop={(e) => onDrop(e, indexQuestion, indexChapter)}
      onDragOver={(e) => onDragOver(e)}
      className="text-sm bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700 p-6 mb-6 hover:border-stone-400 dark:hover:border-stone-400 transition-border duration-300 ease-in-out"
    >
      <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-6">
        <div className="flex items-center mb-4 sm:mb-0">
          <label
            htmlFor="type-question"
            className="text-sm font-medium text-black dark:text-white mr-3"
          >
            {language === 'vi' ? 'Loại đề:' : 'Type:'}
          </label>
          <select
            id="type-question"
            className={`flex flex-wrap text-sm border rounded-md p-2 dark:bg-stone-900 dark:text-white ${typeError
              ? "border-red-500 focus:ring-red-500 dark:border-red-500"
              : "border-stone-300 focus:ring-stone-500"
              }`}
            value={question.type}
            onChange={(e) =>
              handleSelectTypeQuestion(question.questionID, e.target.value)
            }
          >
            <option value="">-</option>
            <option value="trắc nghiệm">
              {language === 'vi' ? 'Trắc nghiệm' : 'Multiple Choice'}
            </option>
            <option value="điền khuyết">
              {language === 'vi' ? 'Điền khuyết' : 'Fill in the Blanks'}
            </option>
            <option value="đục lỗ">
              {language === 'vi' ? 'Đục lỗ (1 đoạn văn bản)' : 'Cloze Test (1 Paragraph)'}
            </option>
            <option value="nghe">
              {language === 'vi' ? 'Nghe' : 'Listening'}
            </option>
            <option value="trọng âm">
              {language === 'vi' ? 'Trọng âm' : 'Stress'}
            </option>
            <option value="shortAnswer">
              {language === 'vi' ? 'Câu hỏi ngắn' : 'Short Answer'}
            </option>
          </select>
        </div>

        <button
          className="text-red-500 hover:text-red-700 transition-colors duration-300"
          type="button"
          onClick={() =>
            deleteQuestion(chapter.chapterID, question.questionID)
          }
        >
          <BsTrash3Fill size={24} />
        </button>
      </div>


      <div className="mb-6">
        {/* Conditional rendering based on question type */}
        {question.type === "trắc nghiệm" && (
          <Mulchoise
            question={question}
            handleChangeQuestion={handleChangeQuestion}
            indexChapter={indexChapter}
            indexQuestion={indexQuestion}
            handleCorrectAnswerChange={handleCorrectAnswerChange}
            handleChangeOptionsQuestion={handleChangeOptionsQuestion}
            errorsQuestion={errorsQuestion}
            questionErrors={questionErrors}
          />
        )}
        {question.type === "điền khuyết" && (
          <FillTheValue
            question={question}
            handleChangeQuestion={handleChangeQuestion}
            indexChapter={indexChapter}
            indexQuestion={indexQuestion}
            handleCorrectAnswerChange={handleCorrectAnswerChange}
            handleChangeOptionsQuestion={handleChangeOptionsQuestion}
            errorsQuestion={errorsQuestion}
            questionErrors={questionErrors}
          />
        )}
        {question.type === "đục lỗ" && (
          <ShortDocument
            question={question}
            handleChangeQuestion={handleChangeQuestion}
            indexChapter={indexChapter}
            indexQuestion={indexQuestion}
            handleCorrectAnswerChange={handleCorrectAnswerChange}
            handleChangeOptionsQuestion={handleChangeOptionsQuestion}
            handleChangeOptionsDocQuestion={handleChangeOptionsDocQuestion}
            handleCorrectAnswerChangeDoc={handleCorrectAnswerChangeDoc}
            addAnswer={addAnswer}
            addOptionsDoc={addOptionsDoc}
            deleteOptionsDoc={deleteOptionsDoc}
            errorsQuestion={errorsQuestion}
            questionErrors={questionErrors}
          />
        )}
        {question.type === "nghe" && (
          <Listenning
            question={question}
            handleChangeQuestion={handleChangeQuestion}
            indexChapter={indexChapter}
            indexQuestion={indexQuestion}
            handleCorrectAnswerChange={handleCorrectAnswerChange}
            handleChangeOptionsQuestion={handleChangeOptionsQuestion}
            errorsQuestion={errorsQuestion}
            questionErrors={questionErrors}
          />
        )}
        {question.type === "trọng âm" && (
          <Stress
            question={question}
            handleChangeQuestion={handleChangeQuestion}
            indexChapter={indexChapter}
            indexQuestion={indexQuestion}
            handleCorrectAnswerChange={handleCorrectAnswerChange}
            handleChangeOptionsQuestion={handleChangeOptionsQuestion}
            errorsQuestion={errorsQuestion}
            questionErrors={questionErrors}
          />
        )}
        {question.type === "shortAnswer" && (
          <ShortAnswer
            question={question}
            handleChangeQuestion={handleChangeQuestion}
            indexChapter={indexChapter}
            indexQuestion={indexQuestion}
            handleCorrectAnswerChange={handleCorrectAnswerChange}
            handleChangeOptionsQuestion={handleChangeOptionsQuestion}
            errorsQuestion={errorsQuestion}
            questionErrors={questionErrors}
          />
        )}
      </div>

      <div className="flex flex-wrap justify-between items-center">
        <div className="flex flex-col mt-2">
          <div className="flex flex-col sm:flex-row items-start ">
            <h2 className="font-bold text-sm text-stone-900 dark:text-stone-100 mb-4 sm:mb-0 sm:mr-4 text-nowrap">
              {language === 'vi' ? 'Mức độ:' : 'Difficulty:'}
            </h2>
            <div className="flex flex-wrap gap-4 w-full">
              {["Dễ", "Trung bình", "Khó"].map((level) => (
                <div key={level} className="flex items-center mb-2 w-full sm:w-auto">
                  <input
                    id={`radio-${level}-${indexChapter}-${indexQuestion}`}
                    type="radio"
                    value={level}
                    name={`level-${indexChapter}-${indexQuestion}`}
                    onChange={(e) => getLevel(indexChapter, indexQuestion, e.target.value)}
                    className="w-4 h-4 text-blue-600 bg-stone-100 border-stone-300 focus:ring-blue-500 dark:bg-stone-700 dark:border-stone-600"
                    required
                  />
                  <label
                    htmlFor={`radio-${level}-${indexChapter}-${indexQuestion}`}
                    className="ml-2 text-sm font-medium text-stone-900 dark:text-stone-300"
                  >
                    {language === 'vi' ? level : level === 'Dễ' ? 'Easy' : level === 'Trung bình' ? 'Medium' : 'Hard'}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>


        {levelError && (
          <p className="text-red-500 text-sm font-medium">
            {language === 'vi' ? '<== Vui lòng chọn mức độ!' : '<== Please select a difficulty level!'}
          </p>
        )}
      </div>


    </div>
  );
};

export default QuestionList;
