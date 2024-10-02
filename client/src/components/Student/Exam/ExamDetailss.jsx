import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ExamDetails() {
    const [exam, setExam] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [answers, setAnswers] = useState({});
    const { examId, submissionId } = useParams();
    const studentId = localStorage.getItem('username');

    const fetchExam = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}student/approvedexams/${examId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setExam(data);
        let minutes = data.time ? parseInt(data.time) : 90;

        const totalSeconds = minutes * 60;
        setTimeLeft(totalSeconds);
    };

    useEffect(() => {
        fetchExam();

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [examId]);

    const handleAnswerChange = (questionId, value) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            const scoreData = {};

            exam.chapters.forEach(chapter => {
                chapter.questions.forEach(question => {
                    // Customize how you handle each type of question
                    // Ensure you are sending the correct format expected by the server
                    if (question.type === 'trọng âm' || question.type === 'nghe') {
                        scoreData[question._id] = answers[question._id] || '';
                    } else if (question.type === 'điền khuyết') {
                        scoreData[question._id] = answers[question._id] || '';
                    } else if (question.type === 'đục lỗ') {
                        scoreData[question._id] = answers[question._id] || [];
                    } else if (question.type === 'shortAnswer') {
                        scoreData[question._id] = answers[question._id] || '';
                    }
                });
            });

            const response = await fetch(`${process.env.REACT_APP_API_URL}student/submitexam/${studentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    approvedExamID: examId,
                    submissionId,
                    scoreData,
                    studentId,
                }),
            });

            if (response.ok) {
                alert("Đã nộp bài thành công!");
            } else {
                alert("Có lỗi xảy ra khi nộp bài.");
            }
        } catch (error) {
            console.error("Error submitting exam:", error);
        }
    };

    const renderQuestion = (question, index) => {
        switch (question.type) {
            case 'trọng âm': // Stress questions
                return (
                    <div className="mb-4 p-4 border border-stone-200 rounded-md">
                        <p><strong>Question {index + 1}:</strong> Choose the word that has a different stress from the others.</p>
                        <div className="flex flex-col">
                            {question.options.map((option, optionIndex) => (
                                <label key={optionIndex} className="flex items-center mb-2">
                                    <input
                                        type="radio"
                                        name={`question-${question._id}`}
                                        value={option}
                                        checked={answers[question._id] === option}
                                        onChange={() => handleAnswerChange(question._id, option)}
                                        className="mr-2"
                                    />
                                    <span dangerouslySetInnerHTML={{ __html: option }} />
                                </label>
                            ))}
                        </div>
                    </div>
                );
            case 'điền khuyết': // Fill-in-the-blank questions
                return (
                  <div className="mb-4 p-4 border border-stone-200 rounded-md">
                        <p><strong>Question {index + 1}:</strong> {question.titleQuestion || 'N/A'}</p>
                        <input
                            type="text"
                            value={answers[question._id] || ''}
                            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                            className="border rounded p-1 w-full"
                        />
                  </div>
                );
            case 'đục lỗ': // Cloze questions
                return (
                    <div className="mb-4 p-4 border border-stone-200 rounded-md">
                        <p><strong>Question {index + 1}:</strong> {question.titleQuestion || 'N/A'}</p>
                        <div className="mb-4">
                            {question.optionsDoc.map((optionList, listIndex) => (
                                <div key={listIndex} className="mb-2">
                                    <strong>Set {listIndex + 1}:</strong>
                                    <select
                                        value={answers[question._id]?.[listIndex] || ''}
                                        onChange={(e) => handleAnswerChange(question._id, {
                                            ...answers[question._id],
                                            [listIndex]: e.target.value
                                        })}
                                        className="border rounded p-1 w-full"
                                    >
                                        <option value="">Select an option</option>
                                        {optionList.map((option, optionIndex) => (
                                            <option key={optionIndex} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'shortAnswer': // Short answer questions
                return (
                    <div className="mb-4 p-4 border border-stone-200 rounded-md">
                        <p><strong>Question {index + 1}:</strong> {question.titleQuestion || 'N/A'}</p>
                        <textarea
                            rows="3"
                            value={answers[question._id] || ''}
                            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                            className="border rounded p-2 w-full"
                        />
                    </div>
                );
            case 'nghe': // Listening questions
                return (
                    <div className="mb-4 p-4 border border-stone-200 rounded-md">
                        <p><strong>Question {index + 1}:</strong> {question.titleQuestion || 'N/A'}</p>
                        <div className="flex flex-col">
                            {question.options.map((option, optionIndex) => (
                                <label key={optionIndex} className="flex items-center mb-2">
                                    <input
                                        type="radio"
                                        name={`question-${question._id}`}
                                        value={option}
                                        checked={answers[question._id] === option}
                                        onChange={() => handleAnswerChange(question._id, option)}
                                        className="mr-2"
                                    />
                                    <span dangerouslySetInnerHTML={{ __html: option }} />
                                </label>
                            ))}
                        </div>
                    </div>
                );
            default:
                return <p>Unknown question type.</p>;
        }
    };

    if (!exam) return <div>Loading...</div>;

    return (
        <div className="bg-white shadow-md rounded-lg p-6 mb-4">
            <div className="bg-stone-100 p-4 rounded-md shadow-inner">
                <h3 className="text-lg font-semibold mb-2">Chapters:</h3>
                {Array.isArray(exam.chapters) && exam.chapters.length > 0 ? (
                    exam.chapters.map((chapter, chapterIndex) => (
                        <div key={chapter._id || chapter.chapterID || 'N/A'} className="border-t border-stone-300 pt-2 mt-2">
                            <h4 className="text-lg font-bold mb-2">{chapter.titleChapter || 'Untitled Chapter'}</h4>
                            <p className="text-stone-700 mb-2"><strong>Score:</strong> {chapter.chapterScore || 'N/A'}</p>
                            <div className="mb-4">
                                {Array.isArray(chapter.questions) && chapter.questions.length > 0 ? (
                                    chapter.questions.map((question, questionIndex) => (
                                        <div key={question._id || question.questionID || 'N/A'} className="mb-4">
                                            {renderQuestion(question, questionIndex)}
                                        </div>
                                    ))
                                ) : (
                                    <p>No questions available.</p>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No chapters available.</p>
                )}
            </div>
            <div className="mt-4">
                <p className="text-lg font-semibold">Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
                <button
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                >
                    Submit Exam
                </button>
            </div>
        </div>
    );
}

export default ExamDetails;
