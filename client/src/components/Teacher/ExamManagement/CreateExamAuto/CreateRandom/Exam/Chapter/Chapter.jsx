import React, { useState } from "react";
import QuestionList from "./Questions/QuestionList";

const Chapter = ({
  examForm,
  chapter,
  indexChapter,
  setExamForm,
  addQuestionToQuestions,
}) => {
  // Tạo biến để kéo thả
  const [draggedItem, setDraggedItem] = useState(null);

  // Hàm để xử lý thay đổi đầu vào cho tiêu đề chương
  const handleChangeChapter /* Hàm thay đổi các giá trị trong chapter: vd: titleChpater,...*/ =
    (indexChapter, e) => {
      const { name, value } = e.target;
      const updatedChapters = [...examForm.chapters];

      // Cập nhật chương hiện tại với tiêu đề mới
      updatedChapters[indexChapter] = {
        ...updatedChapters[indexChapter],
        [name]: value,
      };

      // Cập nhật form bài thi với danh sách các chương đã được cập nhật
      setExamForm({
        ...examForm,
        chapters: updatedChapters,
      });
    };

  // Hàm để xóa một chương
  /* const deleteChapter = (chapterIDClient) => {
    const indexToDelete = examForm.chapters.findIndex(
      (chapter) => chapter.chapterID === chapterIDClient
    );

    if (indexToDelete !== -1) {
      const chaptersDeleted = [...examForm.chapters];
      chaptersDeleted.splice(indexToDelete, 1);

      // Cập nhật lại ID của các chương còn lại
      const updatedChapters = chaptersDeleted.map((chapter, index) => ({
        ...chapter,
        chapterID: index + 1,
      }));

      // Cập nhật form bài thi với danh sách các chương đã được cập nhật
      setExamForm({
        ...examForm,
        chapters: updatedChapters,
      });
    }
  }; */

  // Hàm để thêm một câu hỏi vào chương
  const addQuestion = () => {
    const updatedChapters = [...examForm.chapters];
    const currentChapter = updatedChapters[indexChapter];
    const newQuestion = {
      questionID: currentChapter.questions.length + 1,
      type: "",
      titleQuestion: "",
      options: ["", "", "", ""],
      answer: "",
      level: "",
    };
    const updatedQuestions = [...currentChapter.questions, newQuestion];
    updatedChapters[indexChapter] = {
      ...currentChapter,
      questions: updatedQuestions,
    };

    // Cập nhật form bài thi với danh sách các chương đã được cập nhật
    setExamForm({
      ...examForm,
      chapters: updatedChapters,
    });
  };

  // Hàm thêm answer cho đục lỗ
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

  // Hàm để thay đổi loại của một câu hỏi
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

    // Cập nhật form bài thi với danh sách các chương đã được cập nhật
    setExamForm({
      ...examForm,
      chapters: updatedChapters,
    });
    addQuestionToQuestions(indexChapter, updatedQuestions);
  };

  // Hàm để xóa một câu hỏi khỏi chương
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

        // Cập nhật lại ID của các câu hỏi còn lại trong chương
        for (let i = questionIndex; i < updatedQuestions.length; i++) {
          updatedQuestions[i].questionID = i + 1;
        }

        // Cập nhật lại danh sách các câu hỏi trong chương
        updatedChapters[chapterIndex] = {
          ...updatedChapters[chapterIndex],
          questions: updatedQuestions,
        };

        // Cập nhật form bài thi với danh sách các chương đã được cập nhật
        setExamForm({
          ...examForm,
          chapters: updatedChapters,
        });
      }
    }
  };

  // Xử lý sự kiện kéo và thả
  //<>
  const onDragStart = (
    e,
    indexQuestionClientStart,
    indexChapterClientStart
  ) => {
    e.dataTransfer.setData("text/plain", indexChapterClientStart.toString()); // truyền dữ liệu ra ngoài function

    setDraggedItem(indexQuestionClientStart);
    e.dataTransfer.effectAllowed = "move"; // Cho phép kéo với hiệu ứng di chuyển
  };

  const onDrop = (e, indexQuestionClientDrop, indexChapterClientDrop) => {
    e.preventDefault();

    // Lấy indexChapterClient từ dữ liệu đã truyền là onDragStart
    const indexFromOnDragStart = parseInt(e.dataTransfer.getData("text/plain"));

    // Kiểm tra nếu khác chương thì hiện thông báo ko cho kéo thả qua chương khác
    if (indexFromOnDragStart !== indexChapterClientDrop) {
      alert("Không thể kéo và thả câu hỏi qua chương khác");
      return;
    }

    const updatedChapters = [...examForm.chapters];
    const currentChapter = updatedChapters[indexChapter];
    const draggedQuestion = currentChapter.questions[draggedItem];

    // Xóa câu hỏi đang được kéo khỏi vị trí ban đầu
    currentChapter.questions.splice(draggedItem, 1);
    // Chèn câu hỏi đang được kéo vào vị trí mới
    currentChapter.questions.splice(
      indexQuestionClientDrop,
      0,
      draggedQuestion
    );

    // Gán lại ID cho các câu hỏi
    currentChapter.questions.forEach((question, i) => {
      question.questionID = i + 1;
    });

    updatedChapters[indexChapter] = {
      ...currentChapter,
      questions: currentChapter.questions,
    };

    // Cập nhật trạng thái examForm với danh sách chương đã được cập nhật
    setExamForm({
      ...examForm,
      chapters: updatedChapters,
    });

    setDraggedItem(null); // Đặt lại draggedItem về null sau khi thả
  };

  const onDragOver = (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định để cho phép thả
  };
  //</>

  // function Update Question
  const handleChangeQuestion /* Hàm thay đổi các giá trị trong question. vd: titleQuestion,...*/ =
    (indexChapter, indexQuestion, updatedTitleQuestion) => {
      // Trích xuất name và value từ event target
      const { name, value } = updatedTitleQuestion.target;

      // Truy cập vào mảng questions từ chapter sử dụng chỉ mục (index)
      const updatedQuestions = [...examForm.chapters[indexChapter].questions]; // === questions: []

      // Cập nhật câu hỏi cụ thể trong mảng questions
      updatedQuestions[indexQuestion] = {
        ...updatedQuestions[indexQuestion],
        [name]: value,
      };

      console.log("updatedQuestions: ", updatedQuestions);

      // Truy cập vào mảng chapters từ biểu mẫu kỳ thi (exam form)
      const updatedChapters = [...examForm.chapters]; // === chapters: []

      // Cập nhật chapter cụ thể với mảng questions đã được cập nhật
      updatedChapters[indexChapter] = {
        ...updatedChapters[indexChapter],
        questions: updatedQuestions,
      };

      // Cập nhật biểu mẫu kỳ thi với mảng chapters đã được cập nhật
      setExamForm({
        ...examForm,
        chapters: updatedChapters,
      });
    };

  const handleCorrectAnswerChange /* Cập nhật ansCorrect vào examForm */ = (
    indexChapter,
    indexQuestion,
    indexOptionValue
  ) => {
    // Truy cập vào mảng questions từ chapter sử dụng chỉ mục (index)
    const updatedQuestions = [...examForm.chapters[indexChapter].questions]; // === questions: []

    // Cập nhật đáp án đúng trong mảng questions
    updatedQuestions[indexQuestion] = {
      ...updatedQuestions[indexQuestion],
      answer: indexOptionValue,
    };

    // Truy cập vào mảng chapters từ biểu mẫu kỳ thi (exam form)
    const updatedChapters = [...examForm.chapters]; // === chapters: []

    // Cập nhật chapter cụ thể với mảng questions đã được cập nhật
    updatedChapters[indexChapter] = {
      ...updatedChapters[indexChapter],
      questions: updatedQuestions,
    };

    // Cập nhật biểu mẫu kỳ thi với mảng chapters đã được cập nhật
    setExamForm({
      ...examForm,
      chapters: updatedChapters,
    });
  };

  const handleChangeOptionsQuestion /* Cập nhật InputOptions vào examForm */ = (
    indexChapter,
    indexQuestion,
    optionInput
  ) => {
    const optionsArray = optionInput.options;
    // Truy cập vào mảng questions từ chapter sử dụng chỉ mục (index)
    const updatedQuestions = [...examForm.chapters[indexChapter].questions]; // === questions: []

    // Cập nhật câu hỏi cụ thể trong mảng questions
    updatedQuestions[indexQuestion] = {
      ...updatedQuestions[indexQuestion],
      options: optionsArray,
    };

    console.log("updatedQuestions: ", updatedQuestions);

    // Truy cập vào mảng chapters từ biểu mẫu kỳ thi (exam form)
    const updatedChapters = [...examForm.chapters]; // === chapters: []

    // Cập nhật chapter cụ thể với mảng questions đã được cập nhật
    updatedChapters[indexChapter] = {
      ...updatedChapters[indexChapter],
      questions: updatedQuestions,
    };

    // Cập nhật biểu mẫu kỳ thi với mảng chapters đã được cập nhật
    setExamForm({
      ...examForm,
      chapters: updatedChapters,
    });
  };

  // Hàm khi người dùng nhập answer thì cập nhật vào optionsDoc
  const handleChangeOptionsDocQuestion = (
    indexChapter,
    indexQuestion,
    indexOptionDoc,
    indexOption,
    value
  ) => {
    // Truy cập vào mảng questions từ chapter sử dụng chỉ mục (index)
    const updatedQuestions = [...examForm.chapters[indexChapter].questions];

    // Cập nhật câu hỏi cụ thể trong mảng questions
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

  /***** Fix */
  // Hàm radio answer Document Coreccet cập nhật vào answerDoc
  const handleCorrectAnswerChangeDoc = (
    indexChapter,
    indexQuestion,
    indexOptionDoc,
    indexCheckbox,
    indexCheckboxValue
  ) => {
    const updatedQuestions = [...examForm.chapters[indexChapter].questions];
    // Lấy ra mảng optionsDoc và answerDoc cần cập nhật
    let answerDoc = updatedQuestions[indexQuestion].answerDoc.slice(); // Tạo mảng mới để thay đổi

    // Cập nhật mảng answerDoc với chỉ số của checkbox được checked
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

  // Lấy giá trị Levels
  const getLevel = (indexChapter, indexQuestion, value) => {
    // Truy cập vào mảng questions từ chapter sử dụng chỉ mục (index)
    const updatedQuestions = [...examForm.chapters[indexChapter].questions]; // === questions: []

    // Cập nhật câu hỏi cụ thể trong mảng questions
    updatedQuestions[indexQuestion] = {
      ...updatedQuestions[indexQuestion],
      level: value,
    };

    console.log("updatedQuestions: ", updatedQuestions);

    // Truy cập vào mảng chapters từ biểu mẫu kỳ thi (exam form)
    const updatedChapters = [...examForm.chapters]; // === chapters: []

    // Cập nhật chapter cụ thể với mảng questions đã được cập nhật
    updatedChapters[indexChapter] = {
      ...updatedChapters[indexChapter],
      questions: updatedQuestions,
    };

    // Cập nhật biểu mẫu kỳ thi với mảng chapters đã được cập nhật
    setExamForm({
      ...examForm,
      chapters: updatedChapters,
    });
  };

  return (
    <div className="chapter">
      <div className="border-8 px-5 pt-5 pb-2 mb-5 rounded-md shadow-lg">
        {/* Tiêu đề chương */}
        <div className="flex">
          <input
            type="text"
            name="titleChapter"
            value={chapter.titleChapter}
            onChange={(e) => handleChangeChapter(indexChapter, e)}
            className="border-4 px-2 w-[75%]"
            placeholder={`Chương ${chapter.chapterID}`}
          />

          {/* <button
            onClick={() => deleteChapter(chapter.chapterID)}
            type="button"
            className="ml-auto text-2xl bg-red-600 px-3 mb-2 pb-1 rounded-md text-white"
          >
            X
          </button> */}
        </div>

        {/* Danh sách câu hỏi */}
       {/*  <div className="text-end">
          <button
            onClick={addQuestion}
            type="button"
            className="mb-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            disabled
          >
            Thêm câu hỏi
          </button>
        </div> */}

        {/* Lặp qua danh sách câu hỏi */}
        {chapter.questions.map((question, indexQuestion) => (
          <QuestionList
            key={indexQuestion}
            chapter={chapter}
            question={question}
            addQuestion={addQuestion}
            addOptionsDoc={addOptionsDoc}
            handleSelectTypeQuestion={handleSelectTypeQuestion}
            handleChangeQuestion={handleChangeQuestion}
            deleteQuestion={deleteQuestion}
            indexChapter={indexChapter}
            indexQuestion={indexQuestion}
            handleCorrectAnswerChange={handleCorrectAnswerChange}
            handleCorrectAnswerChangeDoc={handleCorrectAnswerChangeDoc}
            handleChangeOptionsDocQuestion={handleChangeOptionsDocQuestion}
            handleChangeOptionsQuestion={handleChangeOptionsQuestion}
            getLevel={getLevel}
            //Kéo thả question
            onDragStart={onDragStart}
            onDrop={onDrop}
            onDragOver={onDragOver}
          ></QuestionList>
        ))}
      </div>
    </div>
  );
};

export default Chapter;
