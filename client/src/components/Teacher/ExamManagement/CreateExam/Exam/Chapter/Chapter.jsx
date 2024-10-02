import React, { useState } from "react";
import QuestionList from "./Questions/QuestionList";
import { useSelector } from "react-redux";

const Chapter = ({
  examForm,
  chapter,
  indexChapter,
  setExamForm,
  addQuestionToQuestions,
  errorsChapter,
  errorsQuestion,
  addChapterToChapters,
  handleShowDiv
}) => {
  console.log("examForm: ", examForm);
  const language = useSelector((state) => state.language.language);

  const [draggedItem, setDraggedItem] = useState(null);

  const handleChangeChapter = (indexChapter, e) => {
    const { name, value } = e.target;
    const updatedChapters = [...examForm.chapters];
    updatedChapters[indexChapter] = {
      ...updatedChapters[indexChapter],
      [name]: value,
    };

    setExamForm({
      ...examForm,
      chapters: updatedChapters,
    });
  };

  const deleteChapter = (chapterIDClient) => {
    const indexToDelete = examForm.chapters.findIndex(
      (chapter) => chapter.chapterID === chapterIDClient
    );

    if (indexToDelete !== -1) {
      const chaptersDeleted = [...examForm.chapters];
      chaptersDeleted.splice(indexToDelete, 1);

      const updatedChapters = chaptersDeleted.map((chapter, index) => ({
        ...chapter,
        chapterID: index + 1,
      }));

      setExamForm({
        ...examForm,
        chapters: updatedChapters,
      });
    }
  };

  const isChapterComplete = () => chapter.titleChapter.trim() !== "";

  const addQuestion = () => {
    if (!isChapterComplete()) {
      alert(
        "Vui lòng điền đầy đủ thông tin vào chương trước khi thêm câu hỏi!"
      );
      return;
    }

    const updatedChapters = [...examForm.chapters];
    const currentChapter = updatedChapters[indexChapter];
    const newQuestion = {
      questionID: currentChapter.questions.length + 1,
      type: "",
      titleQuestion: "",
      options: ["", "", "", ""],
      answer: "",
      optionsDoc: [],
      answerDoc: [],
      level: "",
    };
    const updatedQuestions = [...currentChapter.questions, newQuestion];
    updatedChapters[indexChapter] = {
      ...currentChapter,
      questions: updatedQuestions,
    };

    setExamForm({
      ...examForm,
      chapters: updatedChapters,
    });
  };

  const addAnswer = (indexChapter, indexQuestion) => {
    const updatedQuestions = [...examForm.chapters[indexChapter].questions];

    updatedQuestions[indexQuestion] = {
      ...updatedQuestions[indexQuestion],
      options: [...updatedQuestions[indexQuestion].options, ""],
    };

    const updatedChapters = [...examForm.chapters];
    updatedChapters[indexChapter] = {
      ...updatedChapters[indexChapter],
      questions: updatedQuestions,
    };

    setExamForm({
      ...examForm,
      chapters: updatedChapters,
    });
  };

  const addOptionsDoc = (indexChapter, indexQuestion) => {
    const updatedQuestions = [...examForm.chapters[indexChapter].questions];

    updatedQuestions[indexQuestion] = {
      ...updatedQuestions[indexQuestion],
      optionsDoc: [
        ...updatedQuestions[indexQuestion].optionsDoc,
        ["", "", "", ""],
      ],
      answerDoc: [...updatedQuestions[indexQuestion].answerDoc, ""],
    };

    const updatedChapters = [...examForm.chapters];
    updatedChapters[indexChapter] = {
      ...updatedChapters[indexChapter],
      questions: updatedQuestions,
    };

    setExamForm({
      ...examForm,
      chapters: updatedChapters,
    });
  };

  const deleteOptionsDoc = (indexChapter, indexQuestion, indexOptionDoc) => {
    const updatedQuestions = [...examForm.chapters[indexChapter].questions];

    updatedQuestions[indexQuestion] = {
      ...updatedQuestions[indexQuestion],
      optionsDoc: updatedQuestions[indexQuestion].optionsDoc.filter(
        (_, idx) => idx !== indexOptionDoc
      ),
      answerDoc: updatedQuestions[indexQuestion].answerDoc.filter(
        (_, idx) => idx !== indexOptionDoc
      ),
    };

    const updatedChapters = [...examForm.chapters];
    updatedChapters[indexChapter] = {
      ...updatedChapters[indexChapter],
      questions: updatedQuestions,
    };

    setExamForm({
      ...examForm,
      chapters: updatedChapters,
    });
  };

  const handleSelectTypeQuestion = (indexQuestion, value) => {
    const updatedChapters = [...examForm.chapters];
    const currentChapter = updatedChapters[indexChapter];
    const updatedQuestions = currentChapter.questions.map((question) =>
      question.questionID === indexQuestion
        ? { ...question, type: value }
        : question
    );
    updatedChapters[indexChapter] = {
      ...currentChapter,
      questions: updatedQuestions,
    };

    setExamForm({
      ...examForm,
      chapters: updatedChapters,
    });
    addQuestionToQuestions(indexChapter, updatedQuestions);
  };

  const deleteQuestion = (chapterIDClient, questionIDClient) => {
    const updatedChapters = [...examForm.chapters];
    const chapterIndex = updatedChapters.findIndex(
      (chapter) => chapter.chapterID === chapterIDClient
    );

    if (chapterIndex !== -1) {
      const updatedQuestions = [...updatedChapters[chapterIndex].questions];
      const questionIndex = updatedQuestions.findIndex(
        (question) => question.questionID === questionIDClient
      );

      if (questionIndex !== -1) {
        updatedQuestions.splice(questionIndex, 1);

        for (let i = questionIndex; i < updatedQuestions.length; i++) {
          updatedQuestions[i].questionID = i + 1;
        }

        updatedChapters[chapterIndex] = {
          ...updatedChapters[chapterIndex],
          questions: updatedQuestions,
        };

        setExamForm({
          ...examForm,
          chapters: updatedChapters,
        });
      }
    }
  };

  const onDragStart = (
    e,
    indexQuestionClientStart,
    indexChapterClientStart
  ) => {
    e.dataTransfer.setData("text/plain", indexChapterClientStart.toString());
    setDraggedItem(indexQuestionClientStart);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDrop = (e, indexQuestionClientDrop, indexChapterClientDrop) => {
    e.preventDefault();

    const indexFromOnDragStart = parseInt(e.dataTransfer.getData("text/plain"));

    if (indexFromOnDragStart !== indexChapterClientDrop) {
      alert("Không thể kéo và thả câu hỏi qua chương khác");
      return;
    }

    const updatedChapters = [...examForm.chapters];
    const currentChapter = updatedChapters[indexChapter];
    const draggedQuestion = currentChapter.questions[draggedItem];

    currentChapter.questions.splice(draggedItem, 1);
    currentChapter.questions.splice(
      indexQuestionClientDrop,
      0,
      draggedQuestion
    );

    currentChapter.questions.forEach((question, i) => {
      question.questionID = i + 1;
    });

    updatedChapters[indexChapter] = {
      ...currentChapter,
      questions: currentChapter.questions,
    };

    setExamForm({
      ...examForm,
      chapters: updatedChapters,
    });

    setDraggedItem(null);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const handleChangeQuestion = (
    indexChapter,
    indexQuestion,
    updatedTitleQuestion
  ) => {
    const { name, value } = updatedTitleQuestion.target;

    const updatedQuestions = [...examForm.chapters[indexChapter].questions];

    updatedQuestions[indexQuestion] = {
      ...updatedQuestions[indexQuestion],
      [name]: value,
    };

    const updatedChapters = [...examForm.chapters];

    updatedChapters[indexChapter] = {
      ...updatedChapters[indexChapter],
      questions: updatedQuestions,
    };

    setExamForm({
      ...examForm,
      chapters: updatedChapters,
    });
  };

  const handleCorrectAnswerChange = (
    indexChapter,
    indexQuestion,
    indexOption
  ) => {
    const updatedQuestions = [...examForm.chapters[indexChapter].questions];

    updatedQuestions[indexQuestion] = {
      ...updatedQuestions[indexQuestion],
      answer: indexOption,
    };

    const updatedChapters = [...examForm.chapters];

    updatedChapters[indexChapter] = {
      ...updatedChapters[indexChapter],
      questions: updatedQuestions,
    };

    setExamForm({
      ...examForm,
      chapters: updatedChapters,
    });
  };

  const handleChangeOptionsQuestion = (
    indexChapter,
    indexQuestion,
    optionInput
  ) => {
    const optionsArray = optionInput.options;

    const updatedQuestions = [...examForm.chapters[indexChapter].questions];

    updatedQuestions[indexQuestion] = {
      ...updatedQuestions[indexQuestion],
      options: optionsArray,
    };

    const updatedChapters = [...examForm.chapters];

    updatedChapters[indexChapter] = {
      ...updatedChapters[indexChapter],
      questions: updatedQuestions,
    };

    setExamForm({
      ...examForm,
      chapters: updatedChapters,
    });
  };

  const handleChangeOptionsDocQuestion = (
    indexChapter,
    indexQuestion,
    indexOptionDoc,
    indexOption,
    value
  ) => {
    const updatedQuestions = [...examForm.chapters[indexChapter].questions];

    updatedQuestions[indexQuestion] = {
      ...updatedQuestions[indexQuestion],
      optionsDoc: updatedQuestions[indexQuestion].optionsDoc.map(
        (optionDoc, idx) =>
          idx === indexOptionDoc
            ? optionDoc.map((opt, i) => (i === indexOption ? value : opt))
            : optionDoc
      ),
    };

    const updatedChapters = [...examForm.chapters];
    updatedChapters[indexChapter] = {
      ...updatedChapters[indexChapter],
      questions: updatedQuestions,
    };

    setExamForm({
      ...examForm,
      chapters: updatedChapters,
    });
  };

  const handleCorrectAnswerChangeDoc = (
    indexChapter,
    indexQuestion,
    indexOptionDoc,
    indexCheckbox,
    indexCheckboxValue
  ) => {
    const updatedQuestions = [...examForm.chapters[indexChapter].questions];
    let answerDoc = updatedQuestions[indexQuestion].answerDoc.slice();

    answerDoc[indexOptionDoc] = indexCheckboxValue;

    updatedQuestions[indexQuestion] = {
      ...updatedQuestions[indexQuestion],
      answerDoc: answerDoc,
    };

    const updatedChapters = [...examForm.chapters];
    updatedChapters[indexChapter] = {
      ...updatedChapters[indexChapter],
      questions: updatedQuestions,
    };

    setExamForm({
      ...examForm,
      chapters: updatedChapters,
    });
  };

  const getLevel = (indexChapter, indexQuestion, value) => {
    const updatedQuestions = [...examForm.chapters[indexChapter].questions];

    updatedQuestions[indexQuestion] = {
      ...updatedQuestions[indexQuestion],
      level: value,
    };

    const updatedChapters = [...examForm.chapters];

    updatedChapters[indexChapter] = {
      ...updatedChapters[indexChapter],
      questions: updatedQuestions,
    };

    setExamForm({
      ...examForm,
      chapters: updatedChapters,
    });
  };



  return (
    <div className="border border-stone-200 dark:border-stone-700 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between border-b pb-4 mb-4">
        <input
          type="text"
          name="titleChapter"
          value={chapter.titleChapter}
          onChange={(e) => handleChangeChapter(indexChapter, e)}
          className={`w-full border border-stone-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-stone-700 dark:text-white  ${errorsChapter.chapters[indexChapter]?.titleChapter
            ? "border-2 border-red-500 focus:ring-red-500 dark:border-stone-300 dark:focus:ring-red-500"
            : "border-stone-300 focus:ring-blue-500"
            }`}
          placeholder={language === 'vi' ? `Chương ${chapter.chapterID}` : `Chapter ${chapter.chapterID}`}
        />
        <button
          onClick={() => deleteChapter(chapter.chapterID)}
          type="button"
          className="ml-4 text-red-600 hover:text-red-800 transition dark:text-red-400"
        >
          <span className="text-2xl">×</span>
        </button>
      </div>

      {chapter.questions.length === 0 ? (
        <p className="text-stone-500 text-center dark:text-stone-400">
          {language === 'vi' ? 'Chưa có câu hỏi nào.' : 'No questions yet.'}

        </p>
      ) : (
        chapter.questions.map((question, indexQuestion) => (
          <QuestionList
            key={question.questionID}
            chapter={chapter}
            question={question}
            addQuestion={addQuestion}
            handleSelectTypeQuestion={handleSelectTypeQuestion}
            handleChangeQuestion={handleChangeQuestion}
            deleteQuestion={deleteQuestion}
            indexChapter={indexChapter}
            indexQuestion={indexQuestion}
            handleCorrectAnswerChange={handleCorrectAnswerChange}
            handleChangeOptionsQuestion={handleChangeOptionsQuestion}
            handleCorrectAnswerChangeDoc={handleCorrectAnswerChangeDoc}
            handleChangeOptionsDocQuestion={handleChangeOptionsDocQuestion}
            getLevel={getLevel}
            onDragStart={onDragStart}
            onDrop={onDrop}
            onDragOver={onDragOver}
            addAnswer={addAnswer}
            addOptionsDoc={addOptionsDoc}
            deleteOptionsDoc={deleteOptionsDoc}
            errorsQuestion={errorsQuestion} // Them
          />
        ))
      )}

      {/* //handleShowDiv */}
      <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs">
        <button
          onClick={handleShowDiv}
          type="button"
          className="bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 transition-colors duration-300 ease-in-out dark:bg-blue-500 dark:text-white"
        >
          {language === 'vi' ? 'Xem trước' : 'Preview'}
        </button>

        <button
          onClick={addChapterToChapters}
          type="button"
          className="bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 transition-colors duration-300 ease-in-out dark:bg-blue-500 dark:text-white"
        >
          {language === 'vi' ? 'Thêm chương' : 'Add Chapter'}
        </button>

        <button
          onClick={addQuestion}
          type="button"
          className="bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 transition-colors duration-300 ease-in-out dark:bg-blue-500 dark:text-white"
        >
          {language === 'vi' ? 'Thêm câu hỏi' : 'Add Question'}
        </button>
      </div>
    </div>
  );
};

export default Chapter;
