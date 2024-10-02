// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import ExamList from "../../ExamList.json";
import "./Question.css";

const PageShowExam = () => {
  const typeAnswer = ["A.", "B.", "C.", "D."];

  const [answers, setAnswers] = useState(
    Array(
      ExamList[0].chapters.reduce(
        (acc, chapter) => acc + chapter.questions.length,
        0
      )
    ).fill(undefined)
  );
  const [showResults, setShowResults] = useState(false);

  const handleAnswerChange = (questionIndex, answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const checkAnswers = () => {
    setShowResults(true);
  };

  const resetQuiz = () => {
    setAnswers(
      Array(
        ExamList[0].chapters.reduce(
          (acc, chapter) => acc + chapter.questions.length,
          0
        )
      ).fill(undefined)
    );
    setShowResults(false);
  };

  return (
    <>
      <div className="containerPreviewExam mt-5">
        <h1>{ExamList[0].titleExam}</h1>
        <h2 className="font-bold text-end">Time: {ExamList[0].time}</h2>
        <div className="chapterContainer">
          {ExamList[0].chapters.map((chapter, indexChapter) => (
            <div key={indexChapter} className={`chapter${indexChapter + 1}`}>
              <h2 className="font-bold">{chapter.nameChapter}</h2>
              {/* Name Chapter */}
              {chapter.questions.map((question, questionIndex) => {
                const qIndex =
                  ExamList[0].chapters
                    .slice(0, indexChapter)
                    .reduce((acc, curr) => acc + curr.questions.length, 0) +
                  questionIndex;

                const userAnswerIndex = answers[qIndex];
                const isCorrect =
                  userAnswerIndex !== undefined &&
                  userAnswerIndex === question.ansCorrect;
                const questionStyle = showResults
                  ? isCorrect
                    ? "bg-green-500"
                    : "bg-red-500"
                  : {};

                return (
                  <div key={`${indexChapter}-${questionIndex}`} className="w-full">
                    {
                      // Nếu các type là trọng âm và từ khác biệt thì không có câu hỏi
                      question.type === "trọng âm" ? (
                        <div className={`flex w-full ${questionStyle}`} >
                          <h2>
                            {qIndex + 1}
                            {". "}
                            {question.titleQuestion}
                          </h2>
                          <div className="answer flex gap-2 w-full items-center">
                            <table className="w-full">
                              <tbody>
                                <tr className="flex justify-between">
                                  {question.options.map(
                                    (option, indexOption) => (
                                      <td key={indexOption} className="py-1 px-1 text-left w-[150px] flex items-center gap-1">
                                        <input
                                          type="radio"
                                          id={`answer_${qIndex}_${indexOption}`}
                                          name={`answer_${qIndex}`}
                                          value={indexOption}
                                          checked={
                                            answers[qIndex] === indexOption
                                          }
                                          onChange={() =>
                                            handleAnswerChange(
                                              qIndex,
                                              indexOption
                                            )
                                          }
                                          disabled={showResults}
                                          className="w-4 h-4"
                                        />
                                        
                                        {typeAnswer[indexOption]}

                                        <span className="text-black"
                                          dangerouslySetInnerHTML={{
                                            __html: option,
                                          }}
                                        />
                                      </td>
                                    )
                                  )}
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ) : (
                        // Nếu các type khắc thì có câu hỏi bình thường
                        <div className={`flex ${questionStyle}`}>
                          <h2 className="font-bold">
                            {qIndex + 1}
                            {". "}
                            {question.titleQuestion}
                          </h2>
                          <div className="answer flex gap-2">
                            <ul className="flex gap-28">
                            </ul>
                          </div>
                        </div>
                      )
                    }
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {!showResults ? (
          <button onClick={checkAnswers}>Submit</button>
        ) : (
          <div>
            <p>Your results:</p>
            <button onClick={resetQuiz}>Reset Quiz</button>
          </div>
        )}
      </div>
    </>
  );
};

export default PageShowExam;
