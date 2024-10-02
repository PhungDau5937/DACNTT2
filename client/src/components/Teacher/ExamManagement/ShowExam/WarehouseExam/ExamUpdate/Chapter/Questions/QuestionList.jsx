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
  handleCorrectAnswerChangeDoc,
  handleChangeOptionsDocQuestion,
  handleChangeOptionsQuestion,
  addQuestion,
  addOptionsDoc,
  deleteQuestion,
  indexChapter,
  indexQuestion,
  handleChangeQuestion,
  getLevel,

  /*Kéo thả => */ onDragStart,
  onDrop,
  onDragOver,
}) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, indexQuestion, indexChapter)}
      onDrop={(e) => onDrop(e, indexQuestion, indexChapter)}
      onDragOver={(e) => onDragOver(e)}
      className="question-item"
    >
      <div className="question space-y-2 border-2 mt-7 px-5 mb-5">
        <div className="text-end">
          <div className="typeQuestion">
            <label
              htmlFor="countries"
              className="pt-1 text-sm font-medium text-gray-900 dark:text-white mr-3"
            >
              Chọn loại đề:
            </label>

            <select
              className="text-sm border-2"
              value={question.type}
              onChange={(e) =>
                handleSelectTypeQuestion(question.questionID, e.target.value)
              }
            >
              <option value="">----------</option>
              <option value="trắc nghiệm">Trắc nghiệm</option>
              <option value="điền khuyết">Điền khuyết</option>
              <option value="đục lỗ">Đục lỗ(1 đoạn văn bản)</option>
              <option value="nghe">Nghe</option>
              <option value="trọng âm">Trọng âm</option>
              <option value="shortAnswer">Câu hỏi ngắn</option>
            </select>
          </div>
        </div>

        {/* Phần Option */}
        <div className="optionQuestion">
          {question.type === "trắc nghiệm" && (
            <>
              <Mulchoise
                question={question}
                handleChangeQuestion={handleChangeQuestion}
                indexChapter={indexChapter}
                indexQuestion={indexQuestion}
                handleCorrectAnswerChange={handleCorrectAnswerChange}
                handleChangeOptionsQuestion={handleChangeOptionsQuestion}
              />
            </>
          )}
          {question.type === "điền khuyết" && (
            <>
              <FillTheValue
                question={question}
                handleChangeQuestion={handleChangeQuestion}
                indexChapter={indexChapter}
                indexQuestion={indexQuestion}
                handleCorrectAnswerChange={handleCorrectAnswerChange}
                handleChangeOptionsQuestion={handleChangeOptionsQuestion}
              />
            </>
          )}
          {question.type === "đục lỗ" && (
            <>
              <ShortDocument
                question={question}
                addOptionsDoc={addOptionsDoc}
                handleChangeQuestion={handleChangeQuestion}
                indexChapter={indexChapter}
                indexQuestion={indexQuestion}
                handleCorrectAnswerChange={handleCorrectAnswerChange}
                handleChangeOptionsDocQuestion={handleChangeOptionsDocQuestion}
                handleCorrectAnswerChangeDoc={handleCorrectAnswerChangeDoc}
                handleChangeOptionsQuestion={handleChangeOptionsQuestion}
              />
            </>
          )}
          {question.type === "nghe" && (
            <>
              <Listenning
                question={question}
                handleChangeQuestion={handleChangeQuestion}
                indexChapter={indexChapter}
                indexQuestion={indexQuestion}
                handleCorrectAnswerChange={handleCorrectAnswerChange}
                handleChangeOptionsQuestion={handleChangeOptionsQuestion}
              />
            </>
          )}
          {question.type === "trọng âm" && (
            <>
              <Stress
                question={question}
                handleChangeQuestion={handleChangeQuestion}
                indexChapter={indexChapter}
                indexQuestion={indexQuestion}
                handleCorrectAnswerChange={handleCorrectAnswerChange}
                handleChangeOptionsQuestion={handleChangeOptionsQuestion}
              />
            </>
          )}
          {question.type === "shortAnswer" && (
            <>
              <ShortAnswer
                question={question}
                handleChangeQuestion={handleChangeQuestion}
                indexChapter={indexChapter}
                indexQuestion={indexQuestion}
                handleCorrectAnswerChange={handleCorrectAnswerChange}
                handleChangeOptionsQuestion={handleChangeOptionsQuestion}
              ></ShortAnswer>
            </>
          )}
        </div>

        <div className="text-end pt-10 flex items-center justify-between">
          {/* Radio Button Dễ, Trung bình, Khó */}
          <div className="flex gap-2 items-center">
            <h2 className="font-bold text-sm">Mức độ: </h2>
            <div className="flex">
              <div className="flex items-center me-4">
                <input
                  id={`radio-easy-${indexQuestion}`}
                  type="checkbox"
                  value="Dễ"
                  name="inline-radio-group"
                  onChange={(e) =>
                    getLevel(indexChapter, indexQuestion, e.target.value)
                  }
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  checked={question.level === "Dễ"}           
               />
                <label
                  htmlFor={`radio-easy-${indexQuestion}`}
                  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Dễ
                </label>
              </div>
              <div className="flex items-center me-4">
                <input
                  id={`radio-nomal-${indexQuestion}`}
                  type="checkbox"
                  value="Trung bình"
                  name="inline-radio-group"
                  onChange={(e) =>
                    getLevel(indexChapter, indexQuestion, e.target.value)
                  }
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  checked={question.level === "Trung bình"}    
                />
                <label
                  htmlFor={`radio-nomal-${indexQuestion}`}
                  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Trung bình
                </label>
              </div>
              <div className="flex items-center me-4">
                <input
                  id={`radio-hard-${indexQuestion}`}
                  type="checkbox"
                  value="Khó"
                  name="inline-radio-group"
                  onChange={(e) =>
                    getLevel(indexChapter, indexQuestion, e.target.value)
                  }
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  checked={question.level === "Khó"}  
                />
                <label
                  htmlFor={`radio-hard-${indexQuestion}`}
                  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Khó
                </label>
              </div>
            </div>
          </div>

          {/* Button icon */}
          <div className="">
            <button className="px-4" type="button">
              <IoMdCopy size={42} onClick={addQuestion} />
            </button>
            <button className="px-4" type="button">
              <BsTrash3Fill
                size={39}
                onClick={() =>
                  deleteQuestion(chapter.chapterID, question.questionID)
                }
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionList;
