import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { MdOutlineTimer } from "react-icons/md";

const ExamDetail = () => {
  const typeAnswer = ["A.", "B.", "C.", "D."];

  // Show modal sau khi submit bai thi
  const [modalConform, setModalConform] = useState(false);
  const handleCancelConform = () => {
    setModalConform(false);
  };

  // So cau dung va diem
  const [soCauDung, setSoCauDung] = useState(0);
  const [diem, setDiem] = useState(0);

  // Trạng thái để lưu trữ thời gian còn lại
  const [timeLeft, setTimeLeft] = useState(0);

  // Trạng thái để lưu trữ các câu trả lời
  const [answersStudent, setAnswersStudent] = useState({});

  // Trạng thái lưu trữ kết quả đúng
  const [correctAnswers, setCorrectAnswers] = useState({});

  const { examId } = useParams();
  console.log("id: ", examId);
  const [exam, setExam] = useState(null);

  const parseTime = (timeString) => {
    // Sử dụng biểu thức chính quy để lấy số phút từ chuỗi
    const match = timeString.match(/(\d+)\s*phút/);
    return match ? parseInt(match[1], 10) : 0; // Nếu không tìm thấy số phút, trả về 0
  };

  // useEffect(() => {
  //   const fetchExam = async () => {
  //     const response = await fetch(`${process.env.REACT_APP_API_URL}student/publicexams/${examId}`);
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }
  //     const data = await response.json();
  //     setExam(data);

  //     // Cài đặt thời gian còn lại và đồng hồ đếm ngược
  //     const minutes = parseTime(exam.time) ; // Thời gian từ API, giả định là phút
  //     const totalSeconds = minutes ? minutes * 60 : 45;      setTimeLeft(totalSeconds);
  //   };

  //   fetchExam();
  // }, [examId]);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}student/publicexams/${examId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setExam(data);
  
        // Đảm bảo rằng exam không phải là null
        if (data && data.time) {
          const minutes = parseTime(data.time); // Thời gian từ API, giả định là phút
          const totalSeconds = minutes ? minutes * 60 : 45; 
          setTimeLeft(totalSeconds);
        }
      } catch (error) {
        console.error('Error fetching exam:', error);
      }
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

  // Chuyển đổi thời gian còn lại thành phút và giây
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    /* return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`; */
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      secs < 10 ? "0" : ""
    }${secs}`;
  };

  const isTimeLow = timeLeft < 10 * 60; // Less than 10 minutes

  const handleAnswerChange = (questionId, value) => {
    setAnswersStudent((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  const handleAnswerChangeShotDoc = (
    questionId,
    optionIndexDoc,
    answerIndex
  ) => {
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

  // remove tag<u>
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

  const handleSubmit = () => {
    setModalConform(true); // show confirm
    // So sánh các giá trị trong object2 với answer tương ứng trong object1
    const comparisonResults = exam.chapters.flatMap((chapter) =>
      chapter.questions.map((question) => {
        const key = question._id;
        const object2Value = removeUTags(answersStudent[key]);

        // Kiểm tra nếu loại câu hỏi là 'đục lỗ'
        if (question.type === "đục lỗ") {
          // So sánh từng phần tử trong mảng optionsAnswer với answerDoc
          const isEqualArray = question.optionsDoc.map(
            (option, index) => object2Value[index] === question.answerDoc[index]
          );
          console.log(`Comparison for question ID ${key}:`, isEqualArray);
          return { id: key, result: isEqualArray };
        } else {
          // So sánh thông thường với answer
          const isEqual = object2Value === question.answer;
          return { id: key, result: isEqual };
        }
      })
    );

    console.log("comparisonResults: ", comparisonResults);

    // Lưu kết quả đúng vào trạng thái
    const correctResults = comparisonResults.reduce((acc, item) => {
      if (Array.isArray(item.result)) {
        // Lưu trữ các câu hỏi đúng
        acc[item.id] = item.result;
      } else {
        acc[item.id] = item.result === true;
      }
      return acc;
    }, {});

    setCorrectAnswers(correctResults);

    // đếm câu đúng
    const countTrueResults = comparisonResults.reduce((count, item) => {
      if (Array.isArray(item.result)) {
        // Đếm số lượng true trong mảng result
        return count + item.result.filter((value) => value === true).length ;
      }
      return count + (item.result === true ? 1 : 0);
    }, 0);

    console.log("dem: ", countTrueResults);
    setSoCauDung(countTrueResults);

    // Tính điểm với mỗi câu là 0.25 điểm
    const score = countTrueResults * 0.25;
    setDiem(score);

    console.log("Score: ", score, examId); // In ra giá trị của score

    // Gui diem qua server
    /* try {
      await axios.post(`/api/exam/${examId}/submit`, {
        examId,
        score,
        //studentID, // Cái này Phát add thêm token id của student 
      });
      // Xử lý sau khi gửi thành công
      alert("Đã nộp bài thành công!");
    } catch (error) {
      console.error("Error submitting exam:", error);
    } */
  };

  /* console.log("Exam for Id: ", exam);
  console.log("answersStudent: ", answersStudent);
  console.log("Exam for Id: ", JSON.stringify(exam, null, 2));
  console.log("answersStudent: ", JSON.stringify(answersStudent, null, 2)); */

  if (!exam) return <div>Loading...</div>;

  const countQuestions = (exam) => {
    if (!exam || !exam.chapters) return 0;
    return exam.chapters.reduce((total, chapter) => {
      return total + chapter.questions.length;
    }, 0);
  };

  return (
    <div className="mt-24 mx-20">
      {modalConform && (
        <div className="fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]">
          <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 relative">
            <div className="text-center">
              <h4 className="text-lg text-gray-800 font-semibold mt-4">
              Number of correct sentences: {soCauDung} / {exam ? 40 : countQuestions(exam)} sentences.
              </h4>
              <h4 className="text-lg text-gray-800 font-semibold mt-4">
                Score: {diem}
              </h4>
            </div>
  
            <div className="flex space-x-4 mt-8">
              <button
                onClick={handleCancelConform}
                type="button"
                className="px-5 py-2.5 rounded-full w-full text-gray-800 text-sm border-none outline-none bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-5 py-2.5 rounded-full w-full text-white text-sm border-none outline-none bg-blue-600 hover:bg-blue-700"
                onClick={()=>{window.location.href = "/student/practicetests"}}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
  
      <div className="buttonBackPage fixed top-0 left-0 right-0 flex items-center justify-center bg-yellow-200 rounded-lg py-2">
        <div className="w-[90%] flex items-center justify-center gap-2 py-1">
          <MdOutlineTimer size={30} />
          {console.log("time: ", formatTime(timeLeft))}
          <h2
            className={
              isTimeLow
                ? "text-red-500 text-2xl font-bold"
                : "text-2xl font-bold"
            }
          >
            {formatTime(timeLeft)}
          </h2>
        </div>
        <div className="w-[10%] flex items-center justify-center">
          <button
            onClick={handleSubmit}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
          >
            Submit
          </button>
        </div>
      </div>
  
      <div className="examStudent">
        <div className="titleExam text-3xl font-bold py-5">
          <h1>{exam.titleExam}</h1>
          <div className="flex flex-col text-end">
            <p className="text-sm">
              <b>Class:</b> {exam.classExam}
            </p>
            <p className="text-sm">
              <b>Time:</b> {exam.time}
            </p>
            <p className="text-sm">
              <b>Score:</b> {exam.score}
            </p>
          </div>
        </div>
  
        {exam.chapters.map((chapter, indexChapter) => (
          <div key={chapter._id || indexChapter} className="chapter pb-5">
            <h2 className="text-xl font-semibold">{chapter.titleChapter}</h2>
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
                  className={`question mb-1 px-2 pb-1 ${
                    isCorrect ? "bg-green-500 rounded-lg" : ""
                  } ${isIncorrect ? "bg-red-500 rounded-lg" : ""}`}
                >
                  <div className="flex items-center gap-2 mt-2">
                    <p className="font-bold text-lg">
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
                  className={`question mb-1 px-2 pb-1 ${
                    isCorrect ? "bg-green-500 rounded-lg" : ""
                  } ${isIncorrect ? "bg-red-500 rounded-lg" : ""}`}
                >
                  <div className="flex items-center gap-2 mt-2">
                    <p className="font-bold text-lg">
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
                  className={`question mb-1 px-2 pb-1 ${
                    isCorrect ? "bg-green-500 rounded-lg" : ""
                  } ${isIncorrect ? "bg-red-500 rounded-lg" : ""}`}
                >
                  <div className="flex items-center gap-2 mt-2">
                    <p className="font-bold text-lg">
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
                  className={`question mb-1 px-2 pb-1 ${
                    isCorrect ? "bg-green-500 rounded-lg" : ""
                  } ${isIncorrect ? "bg-red-500 rounded-lg" : ""}`}
                >
                  <div className="titleShortAnswer flex items-center gap-2 mt-2">
                    <p className="font-bold text-lg">
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
                  <div className="answer flex gap-2 items-center mt-1">
                    <p>Đáp án: </p>
                    <input
                      type="text"
                      className="w-[80%] border-b-2 border-black"
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
                                  className={`py-1 px-1 text-left w-full flex items-center gap-1 question ${
                                    isCorrectDoc[indexOptionDoc] === undefined
                                      ? ""
                                      : isCorrectDoc[indexOptionDoc]
                                      ? "bg-green-500 rounded-lg"
                                      : "bg-red-500 rounded-lg"
                                  }`}
                                >
                                  <p className="font-bold text-lg">
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
                  className={`question mb-1 px-2 pb-1 ${
                    isCorrect ? "bg-green-500 rounded-lg" : ""
                  } ${isIncorrect ? "bg-red-500 rounded-lg" : ""}`}
                >
                  <div className="flex items-center">
                    <p className="font-bold text-lg">
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
