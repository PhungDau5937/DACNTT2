import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MdOutlineTimer } from "react-icons/md";

const ExamDetail = () => {
  const typeAnswer = ["A.", "B.", "C.", "D."];

  const [modalConform, setModalConform] = useState(false);
  const handleCancelConform = () => {
    setModalConform(false);
  };

  const [soCauDung, setSoCauDung] = useState(0);
  const [diem, setDiem] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answersStudent, setAnswersStudent] = useState({});
  const [correctAnswers, setCorrectAnswers] = useState({});

  const { examId, submissionId } = useParams();
  const [exam, setExam] = useState(null);

  useEffect(() => {
    const fetchExam = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}student/approvedexams/${examId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setExam(data);
      let minutes;
      data.time !== "" ? minutes = parseInt(data.time) : minutes = 4;
      const totalSeconds = minutes * 60;
      setTimeLeft(totalSeconds);
    };

    fetchExam();
  }, [examId]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const id = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(id);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const isTimeLow = timeLeft < 10 * 60;

  const handleAnswerChange = (questionId, value) => {
    setAnswersStudent((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  const handleAnswerChangeShotDoc = (questionId, optionIndexDoc, answerIndex) => {
    setAnswersStudent((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: {
        ...prevAnswers[questionId],
        [optionIndexDoc]: answerIndex,
      },
    }));
  };

  const handleTextAnswerChange = (questionId, value) => {
    setAnswersStudent((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  function removeUTags(input) {
    if (input === undefined) {
      return "";
    } else if (typeof input === "string") {
      return input.replace(/<\/?u>/g, "");
    } else if (typeof input === "object" && input !== null) {
      const result = {};
      for (let key in input) {
        if (input.hasOwnProperty(key)) {
          result[key] = removeUTags(input[key]);
        }
      }
      return result;
    } else {
      return input;
    }
  }

  const createExamSubmissions = (answersStudent) => {
    return Object.entries(answersStudent).map(([questionId, answer]) => ({
      questionId,
      answer,
    }));
  };
  
  const compareResults = (exam, answersStudent) => {
    return exam.chapters.flatMap((chapter) =>
      chapter.questions.map((question) => {
        const key = question._id;
        const object2Value = removeUTags(answersStudent[key]);
  
        if (question.type === "đục lỗ") {
          const isEqualArray = question.optionsDoc.map(
            (option, index) => object2Value[index] === question.answerDoc[index]
          );
          return { id: key, result: isEqualArray };
        } else {
          const isEqual = object2Value === question.answer;
          return { id: key, result: isEqual };
        }
      })
    );
  };
  
  const calculateCorrectResults = (comparisonResults) => {
    return comparisonResults.reduce((acc, item) => {
      if (Array.isArray(item.result)) {
        acc[item.id] = item.result;
      } else {
        acc[item.id] = item.result === true;
      }
      return acc;
    }, {});
  };
  
  const countTrueResults = (comparisonResults) => {
    return comparisonResults.reduce((count, item) => {
      if (Array.isArray(item.result)) {
        return count + item.result.filter((value) => value === true).length;
      }
      return count + (item.result === true ? 1 : 0);
    }, 0);
  };
  
  const calculateScore = (countTrueResults) => {
    return countTrueResults * 0.25;
  };
  
  const submitExam = async (approvedExamID, submissionId, scoreData, studentId) => {
    await fetch(`${process.env.REACT_APP_API_URL}student/submitexam/${studentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        approvedExamID,
        submissionId,
        scoreData,
        studentId,
      }),
    });
  };
  
  const handleSubmit = async () => {
    setModalConform(true);
  
    const approvedExamID = examId;
    const examSubmissions = createExamSubmissions(answersStudent);
    const comparisonResults = compareResults(exam, answersStudent);
    const correctResults = calculateCorrectResults(comparisonResults);
    setCorrectAnswers(correctResults);
  
    const countTrueResultsValue = countTrueResults(comparisonResults);
    setSoCauDung(countTrueResultsValue);
  
    const score = calculateScore(countTrueResultsValue);
    setDiem(score);
  
    try {
      const studentId = localStorage.getItem("username");
      const scoreData = {};
      if (exam.examType === 'midterm') {
        scoreData.midTerm = score;
      } else if (exam.examType === 'final') {
        scoreData.finalExam = score;
      }
      await submitExam(approvedExamID, submissionId, scoreData, studentId);
      alert("Đã nộp bài thành công!");
    } catch (error) {
      console.error("Error submitting exam:", error);
    }
  };

  if (!exam) return <div>Loading...</div>;

  return (
    <div className="mt-24 mx-20">
      {modalConform && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h4 className="text-sm font-semibold text-gray-800 mb-4">
              Số câu đúng: {soCauDung} / 40 câu.
            </h4>
            <h4 className="text-sm font-semibold text-gray-800 mb-6">
              Điểm: {diem}
            </h4>
            <div className="flex justify-between">
              <button
                onClick={handleCancelConform}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
              >
                Xác Nhận
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed top-0 left-0 right-0 flex items-center justify-between bg-yellow-200 py-3 px-6 shadow-md">
        <div className="flex items-center gap-2">
          <MdOutlineTimer size={24} />
          <h2 className={`text-2xl font-bold ${isTimeLow ? "text-red-600" : "text-gray-800"}`}>
            {formatTime(timeLeft)}
          </h2>
        </div>
        <button
          onClick={handleSubmit}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md"
        >
          Nộp bài
        </button>
      </div>

      <div className="examStudent">
        {exam.chapters.map((chapter, indexChapter) => (
          <div key={chapter._id || indexChapter} className="chapter pb-5">
            <h2 className="text-xl font-bold mb-4">{chapter.titleChapter}</h2>
            {chapter.questions.map((question, questionIndex) => {
              const questionId = question._id || questionIndex;
              const isCorrect = correctAnswers[questionId];
              const isIncorrect = isCorrect === false;

              let isCorrectDoc = [];
              if (Array.isArray(isCorrect)) {
                isCorrectDoc = correctAnswers[questionId];
              }

              return question.type === "trắc nghiệm" ? (
                <div
                  key={question._id || questionIndex}
                  className={`question mb-4 p-4 border rounded-lg ${isCorrect ? "bg-green-100 border-green-400" : ""
                    } ${isIncorrect ? "bg-red-100 border-red-400" : ""}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-bold">
                      {questionIndex + 1}
                      {". "}
                    </p>
                    <h5
                      className="flex text-justify text-sm"
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
                              className="py-1 px-1 text-left w-[250px] flex items-center gap-1"
                            >
                              <input
                                type="radio"
                                name={`mulchoise-${questionIndex}`}
                                value={option}
                                className="mr-2 w-4 h-4 accent-blue-600"
                                onChange={() =>
                                  handleAnswerChange(questionId, option)
                                }
                              />
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
                <div
                  key={question._id || questionIndex}
                  className={`question mb-4 p-4 border rounded-lg ${isCorrect ? "bg-green-100 border-green-400" : ""
                    } ${isIncorrect ? "bg-red-100 border-red-400" : ""}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-bold">
                      {questionIndex + 1}
                      {". "}
                    </p>
                    <h5
                      className="flex text-justify text-sm"
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
                              className="py-1 px-1 text-left w-[250px] flex items-center gap-1"
                            >
                              <input
                                type="radio"
                                name={`fillTheValue-${questionIndex}`}
                                value={option}
                                className="mr-2 w-4 h-4 accent-blue-600"
                                onChange={() =>
                                  handleAnswerChange(questionId, option)
                                }
                              />
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
                <div
                  key={question._id || questionIndex}
                  className={`question mb-4 p-4 border rounded-lg ${isCorrect ? "bg-green-100 border-green-400" : ""
                    } ${isIncorrect ? "bg-red-100 border-red-400" : ""}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-bold">
                      {questionIndex + 1}
                      {". "}
                    </p>
                    <h5
                      className="flex text-justify text-sm"
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
                              <input
                                type="radio"
                                name={`nghe-${questionIndex}`}
                                value={option}
                                className="mr-2 w-4 h-4 accent-blue-600"
                                onChange={() =>
                                  handleAnswerChange(questionId, option)
                                }
                              />
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
                <div
                  key={question._id || questionIndex}
                  className={`question p-4 mb-4 rounded-lg shadow-md ${isCorrect ? "bg-green-100 border-green-400 border" : ""
                    } ${isIncorrect ? "bg-red-100 border-red-400 border" : ""}`}
                >
                  <div className="titleShortAnswer flex items-center mb-2">
                    <p className="font-semibold text-sm mr-2">{questionIndex + 1}.</p>
                    <h5
                      className="text-sm"
                      dangerouslySetInnerHTML={{ __html: question.titleQuestion }}
                    />
                  </div>
                  <div className="answer">
                    <p className="font-medium mb-2">Đáp án:</p>
                    <input
                      type="text"
                      className="w-full border border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) =>
                        handleTextAnswerChange(questionId, e.target.value)
                      }
                    />
                  </div>
                </div>
              ) : question.type === "đục lỗ" ? (
                <div key={question._id || questionIndex}>
                  <h5
                    className="flex text-justify text-sm mt-1"
                    dangerouslySetInnerHTML={{
                      __html: question.titleQuestion,
                    }}
                  ></h5>
                  <div className="answer flex gap-2 mt-3">
                    <table className="w-full">
                      <tbody>
                        <tr className="flex flex-col justify-between gap-1">
                          {question.optionsDoc.map(
                            (optionDoc, indexOptionDoc) => {
                              return (
                                <td
                                  key={indexOptionDoc}
                                  className={`py-1 px-1 text-left w-full flex items-center gap-1 question ${isCorrectDoc[indexOptionDoc] === undefined
                                    ? ""
                                    : isCorrectDoc[indexOptionDoc]
                                      ? "bg-green-100 border-green-400 border rounded-lg"
                                      : "bg-red-100 border-red-400 border rounded-lg"
                                    }`}
                                >
                                  <p className="font-bold">
                                    {indexOptionDoc + 1}
                                    {". "}
                                  </p>
                                  {optionDoc.map((optionDL, indexOptionDL) => (
                                    <div
                                      key={indexOptionDL}
                                      className="w-[90%] flex gap-2"
                                    >
                                      <input
                                        type="radio"
                                        name={`shortDocument-${questionIndex}-${indexOptionDoc}`}
                                        value={optionDL}
                                        className="mr-2 w-4 h-4 accent-blue-600"
                                        onChange={() =>
                                          handleAnswerChangeShotDoc(
                                            questionId,
                                            indexOptionDoc,
                                            optionDL
                                          )
                                        }
                                      />
                                      <p>{typeAnswer[indexOptionDL]}</p>
                                      <p
                                        dangerouslySetInnerHTML={{
                                          __html: optionDL,
                                        }}
                                      />
                                    </div>
                                  ))}
                                </td>
                              );
                            }
                          )}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : question.type === "trọng âm" ? (
                <div
                  key={question._id || questionIndex}
                  className={`question mb-4 p-4 border rounded-lg ${isCorrect ? "bg-green-100 border-green-400" : ""
                    } ${isIncorrect ? "bg-red-100 border-red-400" : ""}`}
                >
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
                                className="py-1 px-1 text-left w-[250px] flex items-center gap-1"
                              >
                                <input
                                  type="radio"
                                  name={`stress-${questionIndex}`}
                                  value={option}
                                  className="mr-2 w-4 h-4 accent-blue-600"
                                  onChange={() =>
                                    handleAnswerChange(questionId, option)
                                  }
                                />
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
              ) : null;
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamDetail;