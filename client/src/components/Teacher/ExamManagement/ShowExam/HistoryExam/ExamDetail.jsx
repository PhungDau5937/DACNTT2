import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useReactToPrint } from "react-to-print";

import { MdOutlineTimer, MdOutlineFileDownload } from "react-icons/md";

const ExamDetail = () => {
  const typeAnswer = ["A.", "B.", "C.", "D."];
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "ExamDownload",
  });

  const { examId } = useParams();
  console.log("id: ", examId);
  const [exam, setExam] = useState(null);

  useEffect(() => {
    const fetchExam = async () => {
      const res = await axios.get(`teacher/exam/${examId}`);
      setExam(res.data);
    };
    fetchExam();
  }, [examId]);

  console.log("Exam for Id: ", exam);

  if (!exam) return <div>Loading...</div>;

  
  return (
    <div className="w-full p-6 bg-white shadow rounded-lg min-h-96 dark:bg-stone-800">
      <div className="flex flex-col sm:flex-row justify-between items-end pb-4 border-b border-stone-300 dark:border-stone-600">
        <div className="flex items-center gap-2">
          <MdOutlineTimer size={30} />
          <h2 className="text-2xl font-bold">{exam.time}</h2>
        </div>
        <button
          type="button"
          onClick={handlePrint}
          className="relative group flex items-center justify-center p-2 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors"
        >
          <MdOutlineFileDownload size={25} />
          <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-lg -bottom-10 -left-1/2 translate-x-1/2">
            Tải xuống
          </div>
        </button>
      </div>
      <div
        ref={componentRef}
        className="bg-white justify-between py-6 px-14 rounded-lg"
      >
        <div className="titleExam mb-6 border-b border-gray-300 pb-4">
          <h1 className="text-3xl font-bold mb-5 text-center">{exam.titleExam}</h1>
          <div className="text-sm text-gray-700 flex flex-col gap-2">
            <p><b>Lớp:</b> {exam.classExam}</p>
            <p><b>Kỳ thi:</b> {exam.time}</p>
            <p><b>MSHS:</b> ..........................................................................................................</p>
            <p><b>Họ và tên:</b> ...................................................................................................</p>
          </div>
        </div>
        {exam.chapters.map((chapter, indexChapter) => (
          <div key={chapter._id || indexChapter} className="chapter pb-5">
            <h2 className="font-bold text-xl">{chapter.titleChapter}</h2>
            {chapter.questions.map((question, questionIndex) =>
              question.type === "trắc nghiệm" ? (
                <div key={question._id || questionIndex}>
                  <div className="flex items-center gap-2 mt-2">
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
                <div key={question._id || questionIndex}>
                  <div className="flex items-center gap-2 mt-2">
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
                <div key={question._id || questionIndex}>
                  <div className="flex items-center gap-2 mt-2">
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
                <div key={question._id || questionIndex}>
                  <div className="titleShortAnswer flex items-center gap-2 mt-2">
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
                  <div className="answer flex gap-2 items-center mt-1">
                    <p>Đáp án: </p>
                    <input
                      type="text"
                      className="w-[80%] border-b-2 border-black"
                    />
                  </div>
                </div>
              ) : question.type === "đục lỗ" ? (
                <div key={question._id || questionIndex}>
                  <h5
                    className="flex text-justify text-[20px] mt-1"
                    dangerouslySetInnerHTML={{
                      __html: question.titleQuestion,
                    }}
                  ></h5>
                  <div className="answer flex gap-2 mt-3">
                    <table className="w-full">
                      <tbody>
                        <tr className="flex flex-col justify-between">
                          {console.log(question.optionsDoc)}
                          {question.optionsDoc.map((optionDoc, indexOptionDoc) => (
                            <td
                              key={indexOptionDoc}
                              className="py-1 px-1 text-left w-full flex items-center gap-1"
                            >
                              <p className="font-bold">
                                {indexOptionDoc + 1}
                                {". "}
                              </p>
                              {optionDoc.map((optionDL, indexOptionDL) => (
                                <div key={indexOptionDL} className="w-[90%] flex gap-2">
                                  <p>{typeAnswer[indexOptionDL]}</p>
                                  <p
                                    dangerouslySetInnerHTML={{
                                      __html: optionDL,
                                    }}
                                  />
                                </div>
                              ))}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : question.type === "trọng âm" ? (
                <div key={question._id || questionIndex}>
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
                <div key={questionIndex}></div>
              )
            )}
          </div>
        ))}
      </div>
      <style>
        {`
          @media print {
            .print-container {
              width: 210mm;
              min-height: 297mm;
              margin: 0;
              padding: 0;
            }
  
            .print-container h1, .print-container h2, .print-container h5, .print-container p {
              page-break-inside: avoid;
            }
  
            .print-container table {
              width: 100%;
              border-collapse: collapse;
            }
  
            .print-container td {
              border: 1px solid #ddd;
              padding: 8px;
            }
  
            .print-container input {
              border: none;
              border-bottom: 1px solid #000;
              padding: 4px;
              width: 100%;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ExamDetail;