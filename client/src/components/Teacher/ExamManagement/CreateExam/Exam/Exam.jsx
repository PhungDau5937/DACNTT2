import React, { useState, useEffect } from "react";
import TitleExam from "./TitleExam/TitleExam";
import ChapterList from "./Chapter/ChapterList";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000/";

const QuestionsExam = () => {
  const [showForm, setShowForm] = useState(false);


  const [examForm, setExamForm] = useState({
    examID: 1,
    idForTeacher: "",
    titleExam: "",
    classExam: "",
    time: "",
    score: "",
    description: "",
    chapters: [],
  });

  // (Thêm) Lỗi khi bỏ rỗng title Exam
  const [errors, setErrors] = useState({
    titleExam: false,
    classExam: false,
    time: false,
    description: false,
    chapters: [],
  });

  // (Thêm) Lỗi khi bỏ rỗng Chapter
  const [errorsChapter, setErrorsChapter] = useState({
    chapters: [
      {
        titleChapter: false,
        scoreChapter: false,
        questions: [],
      },
    ],
  });

  // (Thêm) Lỗi khi bỏ rỗng Chapter
  const [errorsQuestion, setErrorsQuestion] = useState({
    questions: [
      {
        questionID: false,
        type: false,
        titleQuestion: false,
        options: false,
        answer: false,
        optionsDoc: false,
        answerDoc: false,
        level: false,
      },
    ],
  });

  const handleChangeExamForm = (e) => {
    setExamForm({
      ...examForm,
      [e.target.name]: e.target.value,
    });
  };

  const addChapterToChapters = () => {
    setExamForm({
      ...examForm,
      chapters: [
        ...examForm.chapters,
        {
          chapterID: examForm.chapters.length + 1,
          titleChapter: "",
          questions: [],
        },
      ],
    });
  };

  const addQuestionToQuestions = (indexChapter, contentQuestion) => {
    const updatedChapters = [...examForm.chapters];
    updatedChapters[indexChapter] = {
      ...updatedChapters[indexChapter],
      questions: contentQuestion,
    };
    setExamForm({
      ...examForm,
      chapters: updatedChapters,
    });
  };

  const addDataUploadToChapters = (dataFromUpload) => {
    const newChapters = dataFromUpload.chapters;
    if (!Array.isArray(newChapters)) {
      console.error("Dữ liệu tải lên không phải là một mảng.");
      return;
    }
    setExamForm({
      ...examForm,
      chapters: [...examForm.chapters, ...newChapters],
    });
  };

  const addFirstChapter = () => {
    if (examForm.chapters.length === 0) {
      addChapterToChapters();
    }
  };

  const clickContinue = () => {
    const { titleExam, classExam, time, description } = examForm;

    let hasErrors = false;

    setErrors({
      titleExam: titleExam === "",
      classExam: classExam === "",
      time: time === "",
      description: description === "",
    });

    if (
      titleExam === "" ||
      classExam === "" ||
      time === "" ||
      description === ""
    ) {
      alert("Vui lòng điền đầy đủ thông tin!");
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    setShowForm(true);
    addFirstChapter();
  };

  const checkErrorChapter = () => {
    let hasErrors = false;

    // Kiểm tra từng chương trong mảng chapters
    const updatedErrorsChapter = examForm.chapters.map((chapter) => {
      // Kiểm tra lỗi trong thông tin của chương
      const chapterErrors = {
        titleChapter: chapter.titleChapter === "",
        scoreChapter: chapter.scoreChapter === "",
        questions: [],
      };

      // Nếu có lỗi trong thông tin của chương hoặc câu hỏi
      if (Object.values(chapterErrors).includes(true)) {
        hasErrors = true;
      }

      return chapterErrors;
    });

    // Cập nhật trạng thái lỗi cho chapters
    setErrorsChapter({
      chapters: updatedErrorsChapter,
    });

    if (hasErrors) {
      alert("Vui lòng điền đầy đủ thông tin cho tất cả các chương và câu hỏi!");
      return;
    }
  };



  const checkErrorQuestion = () => {
    let hasErrors = false;

    // Tạo mảng để lưu lỗi của các câu hỏi
    const questionErrorsList = examForm.chapters.map((chapter) => {
      return {
        chapterID: chapter.chapterID,
        questions: chapter.questions.map((question) => {
          // Kiểm tra lỗi trong thông tin của câu hỏi
          const optionsErrors = question.options.length === 4 && question.options.some(option => option === "");
          const optionsValues = question.options.map((option, index) => option === "" ? index : null).filter(index => index !== null);

          const questionErrors = {
            questionID: question.questionID === "",
            type: question.type === "",
            titleQuestion: question.titleQuestion === "",
            options: optionsErrors, // true nếu có lỗi
            optionsValues: optionsValues, // Các giá trị lỗi
            answer: question.answer === "",
            optionsDoc:
              !Array.isArray(question.optionsDoc) ||
              question.optionsDoc.some((optionDoc) => optionDoc === ""),
            answerDoc:
              !Array.isArray(question.answerDoc) ||
              question.answerDoc.some((answerDoc) => answerDoc === ""),
            level: question.level === "",
          };

          // Nếu có lỗi trong thông tin của câu hỏi
          if (Object.values(questionErrors).includes(true)) {
            hasErrors = true;
            return {
              questionID: question.questionID,
              errors: questionErrors,
            };
          }

          return null; // Nếu không có lỗi, trả về null
        }).filter(Boolean) // Lọc các phần tử null
      };
    }).filter((chapter) => chapter.questions.length > 0); // Lọc các chương không có câu hỏi lỗi

    // Cập nhật trạng thái lỗi cho các câu hỏi
    setErrorsQuestion({ questions: questionErrorsList });

    if (hasErrors) {
      alert("Vui lòng điền đầy đủ thông tin cho tất cả các câu hỏi!");
      return;
    }
  };



  const navigate = useNavigate();
  const handleSendExamForm = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("username");
    const updatedExamForm = {
      ...examForm,
      teacherID: userId,
    };

    checkErrorChapter(); // goi ham de gui error qua chapter
    checkErrorQuestion(); // goi ham de gui error qua question

    // (Thêm) Kiểm tra các trường bị thiếu
    const allChaptersComplete = examForm.chapters.every(
      (chapter) =>
        chapter.titleChapter !== "" &&
        chapter.questions.every(
          (question) =>
            question.questionID !== "" &&
            question.type !== "" &&
            question.titleQuestion !== "" &&
            (question.options !== "" || question.optionsDoc !== "") &&
            (question.answer !== "" || question.answerDoc !== "") &&
            question.level !== ""
        )
    );

    if (!allChaptersComplete) {
      return;
    }

    try {
      const { status } = await axios.post(
        "/teacher/createexam",
        updatedExamForm
      );
      if (status === 200) {
        alert("Đã tạo bài thi thành công!");
        navigate("/teacher/repository");
      }
    } catch (error) {
      console.error("Error creating exam:", error);
      alert("Đã xảy ra lỗi khi tạo bài thi!");
    }
  };

  console.log(JSON.stringify(examForm, null, 2));
  console.log("Error Exam: ", errors);
  /* console.log("errorsChapter: ", errorsChapter); */
  console.log("errorsQuestion: ", errorsQuestion);


  const language = useSelector((state) => state.language.language);
  // console.log("Language: ", language);
  return (
    <div className="container mx-auto p-6 bg-white shadow rounded-lg min-h-96 dark:bg-stone-800">

      <header className="flex flex-col sm:flex-row justify-between items-end pb-4 border-b border-stone-300">
        <div className="mb-4 sm:mb-0 text-2xl font-bold dark:text-white pr-4">
          {language === 'vi' ? 'TẠO ĐỀ THI' : 'CREATE EXAM'}
          <p className="text-xs font-normal pt-2 text-stone-600 dark:text-stone-400 pr-4">
            {language === 'vi'
              ? 'Giáo viên có thể tạo các câu hỏi như trắc nghiệm, điền khuyết, điền vào chỗ trống,...'
              : 'Teachers can create questions such as multiple choice, fill in the blanks, etc.'}
          </p>
        </div>
        
      </header>
      <p className="text-xs text-stone-600 dark:text-white pb-4">
        <span className='font-bold'></span>{" "}
        { }
      </p>
      <div className="p-4 pt-6 rounded-lg border border-stone-900 dark:border-stone-200">
        <TitleExam
          examForm={examForm}
          handleChangeExamForm={handleChangeExamForm}
          errors={errors} // (Thêm)
        />
        <button
          onClick={clickContinue}
          type="button"
          className="mt-4 bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xs px-5 py-2.5 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {language === 'vi' ? 'Tiếp tục' : 'Continue'}
        </button>
        {showForm && (
          <div className="mt-8">
            <ChapterList
              examForm={examForm}
              setExamForm={setExamForm}
              addChapterToChapters={addChapterToChapters}
              addQuestionToQuestions={addQuestionToQuestions}
              addDataUploadToChapters={addDataUploadToChapters}
              errorsChapter={errorsChapter} // (Thêm)
              errorsQuestion={errorsQuestion} // (Thêm)
            />

            <button
              type="submit"
              onClick={handleSendExamForm}
              className="mt-4 bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-xs px-5 py-2.5 dark:bg-red-500 dark:hover:bg-red-600"
            >
              {language === 'vi' ? 'TẠO ĐỀ' : 'CREATE EXAM'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionsExam;
