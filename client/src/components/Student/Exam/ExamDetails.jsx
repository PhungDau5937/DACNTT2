import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MdOutlineTimer } from "react-icons/md";

const ExamDetail = () => {
  const typeAnswer = ["A.", "B.", "C.", "D."];
  

  const [modalConform, setModalConform] = useState(false);
  const [soCauDung, setSoCauDung] = useState(0);
  const [diem, setDiem] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answersStudent, setAnswersStudent] = useState({});
  const [correctAnswers, setCorrectAnswers] = useState({});
  const { examId, submissionId } = useParams();
  const [exam, setExam] = useState(null);

  const countQuestions = (exam) => {
    if (!exam || !exam.chapters) return 0;
    return exam.chapters.reduce((total, chapter) => {
      return total + chapter.questions.length;
    }, 0);
  };

  const getInitialTimeLeft = (data) => {
    const storedTimeLeft = localStorage.getItem('timeLeft');
    if (storedTimeLeft !== null) {
      return parseInt(storedTimeLeft, 10);
    }
    return data.time ? parseInt(data.time, 10) * 60 : 45 * 60; // Default to 45 minutes if no time is set
  };

  useEffect(() => {
    const savedAnswers = localStorage.getItem('answersStudent');
    const savedTime = localStorage.getItem('timeLeft');

    if (savedAnswers) {
      setAnswersStudent(JSON.parse(savedAnswers));
    }

    if (savedTime) {
      setTimeLeft(parseInt(savedTime));
    } else {
      setTimeLeft(0);
    }
  }, []);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}student/approvedexams/${examId}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setExam(data);

        if (timeLeft === 0) {
          const initialTimeLeft = getInitialTimeLeft(data);
          setTimeLeft(initialTimeLeft);
          localStorage.setItem('timeLeft', initialTimeLeft); // Save initial time to localStorage
        }
      } catch (error) {
        console.error('Error fetching exam:', error);
      }
    };

    fetchExam();
  }, [examId, timeLeft]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const id = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        if (newTime <= 0) {
          clearInterval(id);
          handleConfirmSubmit(); // Handle submission when time is up
          return 0;
        }
        localStorage.setItem('timeLeft', newTime); // Save time to localStorage
        return newTime;
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

  const removeUTags = (input) => {
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
  };

  const handleSubmit = async () => {
    setModalConform(true);
  };

  const handleConfirmSubmit = async () => {
    if (timeLeft <= 0) {
      alert("Thời gian đã hết. Nộp bài...");
    }

    const allAnswered = exam.chapters.every((chapter) =>
      chapter.questions.every((question) => {
        const questionId = question._id;
        const answer = answersStudent[questionId];
        if (question.type === "đục lỗ") {
          return answer && Object.values(answer).every((val) => val !== undefined && val !== "");
        } else {
          return answer !== undefined && answer !== "";
        }
      })
    );

    if (!allAnswered) {
      alert("Bạn cần trả lời tất cả các câu hỏi trước khi nộp bài.");
      return;
    }

    const approvedExamID = examId;
    const examSubmissions = Object.entries(answersStudent).map(([questionId, answer]) => ({
      questionId,
      answer,
    }));

    const comparisonResults = exam.chapters.flatMap((chapter) =>
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

    const correctResults = comparisonResults.reduce((acc, item) => {
      if (Array.isArray(item.result)) {
        acc[item.id] = item.result;
      } else {
        acc[item.id] = item.result === true;
      }
      return acc;
    }, {});

    setCorrectAnswers(correctResults);

    // const countTrueResults = comparisonResults.reduce((count, item) => {
    //   if (Array.isArray(item.result)) {
    //     return count + item.result.filter((value) => value === true).length;
    //   }
    //   return count + (item.result === true ? 1 : 0);
    // }, 0);

    // setSoCauDung(countTrueResults);

    // const roundToNearestQuarter = (num) => {
    //   return Math.round(num * 4) / 4;
    // };

    // const score = roundToNearestQuarter(countTrueResults * countQuestions(exam) / 10);
    // console.log(score);
    // setDiem(score);
    // đếm câu đúng
    const countTrueResults = comparisonResults.reduce((count, item) => {
      if (Array.isArray(item.result)) {
        // Đếm số lượng true trong mảng result
        return count + item.result.filter((value) => value === true).length;
      }
      return count + (item.result === true ? 1 : 0);
    }, 0);

    console.log("dem: ", countTrueResults);
    setSoCauDung(countTrueResults);

    // Tính điểm với mỗi câu là 0.25 điểm
    const score = countTrueResults * 0.25;
    setDiem(score);

    try {
      const studentId = localStorage.getItem("username");
      const scoreData = {};
      if (exam.examType === 'midterm') {
        scoreData.midTerm = score;
      } else if (exam.examType === 'final') {
        scoreData.finalExam = score;
      }
      
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

      window.location.href = "/student/practicetests"
      
      
      alert("Đã nộp bài thành công!");
    } catch (error) {
      console.error("Error submitting exam:", error);
    }

    // Clear local storage
    localStorage.removeItem('timeLeft');
    localStorage.removeItem('answersStudent');
  };

  const handleCancelConform = () => {
    setModalConform(false);
  };

  useEffect(() => {
    if (timeLeft <= 0) return;

    const id = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(id);
          handleConfirmSubmit(); // Handle submission when time is up
          return 0;
        }
        localStorage.setItem('timeLeft', prevTime - 1); // Save time to localStorage
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [timeLeft]);

  if (!exam) return <div>Loading...</div>;
  return (
    <div className="mt-24 mx-5 bg-white">
      {modalConform && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Số câu đúng: {soCauDung} / {`${countQuestions}`} câu.
            </h4>
            <h4 className="text-lg font-semibold text-gray-800 mb-6">
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
          onClick={handleConfirmSubmit}
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

              return question.type === "trắc nghiệm" ? (
                <div
                  key={question._id || questionIndex}
                  className="question mb-4 p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-bold">
                      {questionIndex + 1}
                      {". "}
                    </p>
                    <h5
                      className="flex text-justify text-lg"
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
                  className="question mb-4 p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-bold">
                      {questionIndex + 1}
                      {". "}
                    </p>
                    <h5
                      className="flex text-justify text-lg"
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
                  className="question mb-4 p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-bold">
                      {questionIndex + 1}
                      {". "}
                    </p>
                    <h5
                      className="flex text-justify text-lg"
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
                  className="question p-4 mb-4 rounded-lg shadow-md"
                >
                  <div className="titleShortAnswer flex items-center mb-2">
                    <p className="font-semibold text-lg mr-2">{questionIndex + 1}.</p>
                    <h5
                      className="text-lg"
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
                    className="flex text-justify text-lg mt-1"
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
                                  className="py-1 px-1 text-left w-full flex items-center gap-1 question"
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
                  className="question mb-4 p-4 border rounded-lg"
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