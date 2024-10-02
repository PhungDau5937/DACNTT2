import React, { useState } from "react";
import TitleExam from "./TitleExam/TitleExam";
import ChapterList from "./Chapter/ChapterList";

import { useNavigate } from "react-router-dom";

import axios from "axios";

// URL de ket noi qua server
axios.defaults.baseURL = "http://localhost:8000/";

const ExamUpdate = ({ examForID }) => {
  const showForm = useState(true);

  // Tạo chapterForm và setChapterForm
  const [examForm, setExamForm] = useState(examForID); // Cho examForID tương ứng sao examForm

  // Tạo một function cập nhật || thay đổi chapterForm
  const handleChangeExamForm = (e) => {
    setExamForm({
      ...examForm, //Tạo một bản sao của chapterForm để ghi thêm value mới vào.
      [e.target.name]: e.target.value, // name phải trùng với value VD: <input name="titleExam" value={chapterForm.titleExam} />
    });
  };

  // function thêm từng chapter được tạo vào chapters: []
  const addChapterToChapters = () => {
    setExamForm({
      ...examForm,
      chapters: [
        ...examForm.chapters, // === chapters: []
        {
          chapterID: examForm.chapters.length + 1, // Khi xóa chapter thì đồ dài sẽ thay đổi vd: 2 chapter có length = 2, sau khi xóa thì length còn lại 1 nền khi tạo một chương mới thì sẽ cộng thêm 1.
          titleChapter: "",
          questions: [],
        },
      ],
    });
  };

  // function thêm từng question được tạo vào question: []
  const addQuestionToQuestions = (indexChapter, contentQuestion) => {
    const updatedQuestionToChapter = [...examForm.chapters]; // === chapters []
    updatedQuestionToChapter[indexChapter] = {
      ...updatedQuestionToChapter[indexChapter],
      questions: contentQuestion,
    };
    setExamForm({
      ...examForm,
      chapters: updatedQuestionToChapter,
    });
  };

  /*  console.log("Data Json Exam: ", JSON.stringify(examForm, null, 2));
   */
  // Send data to Server PORT: 8000
  const navigation = useNavigate(); // Dùng thử viện để điều hướng page
  const handleSendExamFormUpdate = async (e) => {
    e.preventDefault();
    // Gửi examForm lên server bằng axios
    const dataExam = await axios.put("teacher/update", examForm);
    if (dataExam.status === 200) {
      alert("Đã cập nhật bài thi thành công!");
      navigation("/teacher/repository"); // điều hướng ra lại /teacher/exam
    }

    resetPage(); // reset page
  };

  // reset page khi upload
  const resetPage = () => {
    window.location.reload();
  };

  console.log(JSON.stringify(examForm, null, 2))

  return (
    <div className="exam">
      {/* ContentExam */}
      <div className="border-2 px-5 pt-5 pb-2 rounded-md">
        {/* Title Exam */}
        <TitleExam
          examForm={examForm}
          handleChangeExamForm={handleChangeExamForm}
        ></TitleExam>

        {/* Form Chapter and question */}
        <div className="relative w-full mx-auto mt-10 h-full">
          {showForm && (
            <>
              <ChapterList
                examForm={examForm}
                setExamForm={setExamForm}
                addChapterToChapters={addChapterToChapters}
                addQuestionToQuestions={addQuestionToQuestions} // questions
              />

              {/* Button gửi Json Data */}
              <button
                type="submit"
                onClick={handleSendExamFormUpdate}
                className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              >
                UPDATE EXAM
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamUpdate;
