import React, { useState, useEffect } from "react";
import { AiOutlinePlusSquare } from "react-icons/ai";
import { FaEye } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdOutlineTimer } from "react-icons/md";
import Chapter from "./Chapter";
import { RiUpload2Fill } from "react-icons/ri";

import WordDownload from "./UploadFlie/FileDownload/WordDownload";




const ChapterList = ({
  examForm,
  setExamForm,
  addChapterToChapters,
  addQuestionToQuestions,
  addDataUploadToChapters,
}) => {
  const typeAnswer = ["A.", "B.", "C.", "D."];

  // Show model upload file
  const [showModelUpload, setshowModelUpload] = useState(false);

  const showUploadFile = () => {
    setshowModelUpload(true);
  };

  const closeUploadFile = () => {
    setshowModelUpload(false);
  };

  // Button xem trước
  const [showDiv, setShowDiv] = useState(false);
  const [moveDiv, setMoveDiv] = useState(false);

  const handleShowDiv = () => {
    setShowDiv(true);
    setMoveDiv(true);
  };

  // Ẩn xem trước
  const handleHideDiv = () => {
    setMoveDiv(false);
    setTimeout(() => {
      setShowDiv(false);
    }, 500); // Thời gian delay phải khớp với thời gian animation
  };

  // scroll
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 500) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  
  // Hàm lấy data(các chương) từ UploadFileWord.jsx
  const sendChapterToExam = (data) => {
    
    console.log("Data Upload gửi qua ChapterList: ", data)
    
    addDataUploadToChapters(data)// Thêm data Chương từ File Upload vào examFrom
  };

  return (
    <>
      <div className="chapterList">
        {/* Menu */}
        <div className="absolute">
          <div
            className={`menu fixed ${scrolled ? "top-24" : "top-94"} right-64`}
          >
            <div className="wrapperMenu w-[60px] border-2 rounded-lg flex flex-col items-center p-2">
              <div className="addChapters cursor-pointer hover:bg-gray-200 w-[40px] h-[40px] flex items-center justify-center p-1 rounded-full">
                <div className="relative group">
                  <button onClick={addChapterToChapters} type="button">
                    <AiOutlinePlusSquare />
                  </button>
                  <div className="absolute shadow-lg hidden group-hover:block bg-[#333] text-white font-semibold px-1 text-[10px] left-full ml-7 top-0 bottom-0 my-auto h-max w-max rounded before:w-2 before:h-2 before:rotate-45 before:bg-[#333] before:absolute before:z-[-1] before:bottom-0 before:top-0 before:my-auto before:-left-1 before:mx-auto">
                    Thêm chương
                  </div>
                </div>
              </div>

              <div className="addQuestions cursor-pointer hover:bg-gray-200 w-[40px] h-[40px] flex items-center justify-center p-1 rounded-full">
                <div className="relative group">
                  <button type="button" onClick={handleShowDiv}>
                    <FaEye />
                  </button>
                  <div className="absolute shadow-lg hidden group-hover:block bg-[#333] text-white font-semibold px-1 text-[10px] left-full ml-7 top-0 bottom-0 my-auto h-max w-max rounded before:w-2 before:h-2 before:rotate-45 before:bg-[#333] before:absolute before:z-[-1] before:bottom-0 before:top-0 before:my-auto before:-left-1 before:mx-auto">
                    Xem trước
                  </div>
                </div>
              </div>

              <div className="addQuestions cursor-pointer hover:bg-gray-200 w-[40px] h-[40px] flex items-center justify-center p-1 rounded-full">
                <div className="relative group">
                  <button type="button" onClick={showUploadFile}>
                    <RiUpload2Fill />
                  </button>
                  <div className="absolute shadow-lg hidden group-hover:block bg-[#333] text-white font-semibold px-1 text-[10px] left-full ml-7 top-0 bottom-0 my-auto h-max w-max rounded before:w-2 before:h-2 before:rotate-45 before:bg-[#333] before:absolute before:z-[-1] before:bottom-0 before:top-0 before:my-auto before:-left-1 before:mx-auto">
                    Tải lên file
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ContentQuestion */}
        <div className="chapterList border-2 px-5 pt-5 pb-2 rounded-md">
          {/* Phần (Chương) */}
          {/* Hiển thị danh sách các thẻ Câu hỏi của chương */}
          {examForm.chapters.map((chapter, indexChapter) => (
            <Chapter
              key={indexChapter}
              examForm={examForm}
              setExamForm={setExamForm}
              chapter={chapter}
              indexChapter={indexChapter}
              addQuestionToQuestions={addQuestionToQuestions}
              addChapterToChapters={addChapterToChapters}
            ></Chapter>
          ))}
        </div>
      </div>
      {/*Full page preview */} {/* Con mắt xem trước */}
      {showDiv && (
        <div className={`preview-div flex-col ${moveDiv ? "move" : ""}`}>
          {/* Button Close page preview */}
          <div className="buttonBackPage flex items-center justify-center bg-green-500 py-2">
            {/* Button back */}
            <div className="button-close relative group cursor-pointer hover:bg-white w-[40px] h-[40px] flex items-center justify-center p-1 rounded-full">
              <button onClick={handleHideDiv} type="button" className="">
                <IoMdArrowRoundBack size={25} />
              </button>
              <div className="absolute shadow-lg hidden group-hover:block bg-[#333] text-white font-semibold px-1 text-[10px] left-full ml-2 top-0 bottom-0 my-auto h-max w-max rounded before:w-2 before:h-2 before:rotate-45 before:bg-[#333] before:absolute before:z-[-1] before:bottom-0 before:top-0 before:my-auto before:-left-1 before:mx-auto">
                Trở về
              </div>
            </div>
            {/* Time */}
            <div className="w-full flex items-center justify-center gap-2 py-1">
              <MdOutlineTimer size={30} />
              <h2 className="text-2xl font-bold">{examForm.time}</h2>
            </div>
          </div>
          {/* Preview Exam */}
          <div className="containerPreviewExam mt-5">
            <div className="titleExam">
              <h1>{examForm.titleExam}</h1>
              <div className="flex flex-col text-end">
                <p className="text-xs">
                  <b>Lớp:</b> {examForm.classExam}
                </p>
                <p className="text-xs">
                  <b>Thời gian:</b> {examForm.time}
                </p>
                <p className="text-xs">
                  <b>Điểm:</b> {examForm.score}
                </p>
              </div>
            </div>

            {examForm.chapters.map((chapter, indexChapter) => (
              <div key={indexChapter} className="chapter pb-5">
                <h2>{chapter.titleChapter}</h2>
                {/* Name Chapter */}
                {chapter.questions.map((question, questionIndex) =>
                  question.type === "trắc nghiệm" ? (
                    <div key={questionIndex}>
                      <div className="flex items-center gap-2">
                        <p className="font-bold">
                          {questionIndex + 1}
                          {". "}
                        </p>
                        <h5
                          className="flex text-justify text-[20px]"
                          dangerouslySetInnerHTML={{
                            __html: question.titleQuestion,
                          }}
                        ></h5>
                      </div>
                      <div className="answer flex gap-2">
                        <table className="w-full">
                          <tbody>
                            <tr className="flex justify-between">
                              {question.options.map((option, indexOption) => (
                                <td
                                  key={indexOption}
                                  className="py-1 px-1 text-left w-[150px] flex items-center gap-1"
                                >
                                  <p>{typeAnswer[indexOption]}</p>
                                  <p
                                    dangerouslySetInnerHTML={{
                                      __html: option,
                                    }}
                                  />
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : question.type === "điền khuyết" ? (
                    <div key={questionIndex}>
                      <div className="flex items-center gap-2">
                        <p className="font-bold">
                          {questionIndex + 1}
                          {". "}
                        </p>
                        <h5
                          className="flex text-justify text-[20px]"
                          dangerouslySetInnerHTML={{
                            __html: question.titleQuestion,
                          }}
                        ></h5>
                      </div>
                      <div className="answer flex gap-2">
                        <table className="w-full">
                          <tbody>
                            <tr className="flex justify-between">
                              {question.options.map((option, indexOption) => (
                                <td
                                  key={indexOption}
                                  className="py-1 px-1 text-left w-[150px] flex items-center gap-1"
                                >
                                  <p>{typeAnswer[indexOption]}</p>
                                  <p
                                    dangerouslySetInnerHTML={{
                                      __html: option,
                                    }}
                                  />
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : question.type === "nghe" ? (
                    <div key={questionIndex}>
                      <div className="flex items-center gap-2">
                        <p className="font-bold">
                          {questionIndex + 1}
                          {". "}
                        </p>
                        <h5
                          className="flex text-justify text-[20px]"
                          dangerouslySetInnerHTML={{
                            __html: question.titleQuestion,
                          }}
                        ></h5>
                      </div>

                      <div className="answer flex gap-2">
                        <table className="w-full">
                          <tbody>
                            <tr className="flex flex-col justify-between">
                              {question.options.map((option, indexOption) => (
                                <td
                                  key={indexOption}
                                  className="py-1 px-1 text-left w-full flex items-center gap-1"
                                >
                                  <p>{typeAnswer[indexOption]}</p>
                                  <p
                                    dangerouslySetInnerHTML={{
                                      __html: option,
                                    }}
                                  />
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : question.type === "shortAnswer" ? (
                    <div key={questionIndex}>
                      <div className="titleShortAnswer flex items-center gap-2">
                        <p className="font-bold">
                          {questionIndex + 1}
                          {". "}
                        </p>
                        <h5
                          className="flex text-justify text-[20px]"
                          dangerouslySetInnerHTML={{
                            __html: question.titleQuestion,
                          }}
                        ></h5>
                      </div>
                      <div className="answer flex gap-2 items-center">
                        <p>Đáp án: </p>
                        <input
                          type="text"
                          className="w-[90%] border-b-2 border-black"
                        />
                      </div>
                    </div>
                  ) : question.type === "đục lỗ" ? (
                    <div key={questionIndex}>
                      <h5
                        className="flex text-justify text-[20px]"
                        dangerouslySetInnerHTML={{
                          __html: question.titleQuestion,
                        }}
                      ></h5>

                      <div className="answer flex gap-2 mt-2">
                        <table className="w-full">
                          <tbody>
                            <tr className="flex flex-col justify-between">
                              {question.optionsDoc.map(
                                (optionDoc, indexoptionDoc) => (
                                  <td
                                    key={indexoptionDoc}
                                    className="py-1 px-1 text-left w-full flex items-center gap-1"
                                  >
                                    <p className="font-bold">
                                      {indexoptionDoc + 1}
                                      {". "}
                                    </p>

                                    {optionDoc.map(
                                      (optionDL, indexOptionDL) => (
                                        <div className="w-[90%] flex gap-2">
                                          <p>{typeAnswer[indexOptionDL]}</p>
                                          <p
                                            dangerouslySetInnerHTML={{
                                              __html: optionDL,
                                            }}
                                          />
                                          {console.log("optionDL: ", optionDL)}
                                        </div>
                                      )
                                    )}
                                  </td>
                                )
                              )}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : question.type === "trọng âm" ? (
                    <div key={questionIndex}>
                      <div className="flex items-center">
                        <p className="font-bold">
                          {questionIndex + 1}
                          {". "}
                        </p>
                        <div className="answer flex gap-2 w-full">
                          <table className="w-full">
                            <tbody>
                              <tr className="flex justify-between">
                                {question.options.map((option, indexOption) => (
                                  <td
                                    key={indexOption}
                                    className="py-1 px-1 text-left w-[150px] flex items-center gap-1"
                                  >
                                    <p>{typeAnswer[indexOption]}</p>
                                    <p
                                      dangerouslySetInnerHTML={{
                                        __html: option,
                                      }}
                                    />
                                  </td>
                                ))}
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Full page preview */}
      {/* Show Model upload */}
      {showModelUpload && ( <WordDownload closeUploadFile={closeUploadFile} sendChapterToExam={sendChapterToExam}/>
        
      )}
    </>
  );
};

export default ChapterList;
