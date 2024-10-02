import React, { useState } from "react";
import TitleExam from "./TitleExam/TitleExam";
// import TitleExam from "../../../CreateExam/CreateExam";
import ChapterList from "./Chapter/ChapterList";

import WordDownloadForm from "../ExamUpdate/Chapter/UploadFlie/FileDownload/WordDownloadForm";

import { useNavigate } from "react-router-dom";

import axios from "axios";

// URL de ket noi qua server
axios.defaults.baseURL = "http://localhost:8000/";



const QuestionsExam = () => {
  const showForm = useState(true);
  const showChapter = false;

  const [showUploadFile, setShowUploadFile] = useState(true);
  const [showDetailUpload, setShowDetailUpload] = useState(false);

  const closeShowUpdateFile = () => {
    setShowUploadFile(false);
  };
  const openDetailUpload = () => {
    setShowDetailUpload(true);
  };

  const [dataFormUploadIndex, setDataFormUploadIndex] = useState();

  const sendChapterToExam = (data) => {
    if (data !== "") {
      setDataFormUploadIndex(data);
    }
  };

  // Tạo chapterForm và setChapterForm
  const [examForm, setExamForm] = useState({
    examID: 1,
    titleExam: "",
    classExam: "",
    time: "",
    score: "",
    description: "",
    chapters: [],
  });

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
    console.log("contentQuestion: ", contentQuestion);
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

  // Hàm them data khi Upload File thêm vào chapters: []
  const addDataUploadToChapters = (dataFromUpload) => {
    const newChapters = dataFromUpload.chapters;
    console.log("newChapters", newChapters);

    if (!Array.isArray(newChapters)) {
      console.error("Dữ liệu tải lên không phải là một mảng.");
      return;
    }

    // Cập nhật examForm với các chương mới
    setExamForm({
      ...examForm,
      chapters: [...examForm.chapters, ...newChapters], // Thêm các chương mới vào danh sách chương hiện tại
    });
  };

  // Hàm thêm data ở index khi Upload File thêm vào chapters: []
  const addDataUploadToChaptersIndex = (dataFormUploadIndex) => {
    const newChapters = dataFormUploadIndex.chapters;
    console.log("newChapters", newChapters);

    if (!Array.isArray(newChapters)) {
      console.error("Dữ liệu tải lên không phải là một mảng.");
      return;
    }

    // Cập nhật examForm với các chương mới
    setExamForm({
      ...examForm,
      chapters: [...examForm.chapters, ...newChapters], // Thêm các chương mới vào danh sách chương hiện tại
    });
  };

  console.log("Data Json Exam: ", JSON.stringify(examForm, null, 2));

  // Send data to Server PORT: 8000
  const navigation = useNavigate(); // Dùng thử viện để điều hướng page
  const handleSendExamForm = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("username"); // Lấy userId từ localStorage
  
    // Thêm teacherID vào examForm
    const updatedExamForm = {
      ...examForm,
      teacherID: userId // Thêm teacherID vào form dữ liệu
    };
  
    console.log("Data send: ", updatedExamForm);
  
    try {
      // Gửi updatedExamForm lên server bằng axios
      const dataExam = await axios.post("/teacher/createexam", updatedExamForm);
      console.log("dataExam", dataExam.status);
      if (dataExam.status === 200) {
        alert("Đã tạo bài thi thành công!");
        navigation("/teacher/repository"); // điều hướng ra lại /teacher/exam
      }
    } catch (error) {
      console.error("Error creating exam:", error);
      alert("Đã xảy ra lỗi khi tạo bài thi!");
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow rounded-lg min-h-96 dark:bg-stone-800">
      <header className="flex flex-col py-4 sm:flex-row justify-between items-end pb-4 border-b border-stone-300">
        <div className="mb-4 sm:mb-0 text-2xl font-bold dark:text-white pr-4">
          CREATE EXAM
          <p className="text-xs font-normal pt-2 text-stone-600 dark:text-stone-400 pr-4">

              Teachers can create questions such as multiple choice, fill in the blanks, etc. from the uploaded file.
          </p>
        </div>
        <p className="text-xs text-stone-600 dark:text-white pb-4">
        <span className='font-bold'></span>{" "}
        { }
      </p>
        
      </header>
      {showUploadFile && (
        <WordDownloadForm
          addDataUploadToChaptersIndex={addDataUploadToChaptersIndex}
          openDetailUpload={openDetailUpload}
          closeShowUpdateFile={closeShowUpdateFile}
          sendChapterToExam={sendChapterToExam}
          dataFormUploadIndex={dataFormUploadIndex}
        />
      )}

      {showDetailUpload && (
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
                  
                  {showChapter && 
                  (<ChapterList
                    examForm={examForm}
                    setExamForm={setExamForm}
                    addChapterToChapters={addChapterToChapters}
                    addQuestionToQuestions={addQuestionToQuestions} // questions
                    addDataUploadToChapters={addDataUploadToChapters}
                  />)}

                  {/* Button gửi Json Data */}
                  
                  <button
                    type="button"
                    onClick={handleSendExamForm}
                    className="mt-4 bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-xs px-5 py-2.5 dark:bg-red-500 dark:hover:bg-red-600"
                    >
                    CREATE EXAM
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionsExam;
