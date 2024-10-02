import React, { useState } from 'react';
import { MdVisibility, MdVisibilityOff, MdQuestionAnswer, MdDescription, MdBook, MdInfo } from 'react-icons/md';

function ExamDetails({ exam }) {
    const [showDetails, setShowDetails] = useState(false);
    console.log(exam);
    if (!exam) {
        return null;
    }

    const processOptions = (options) => {
        return options.map(opt => {
            const processedOption = opt.replace(/<u>(.*?)<\/u>/g, '<u><b>$1</b></u>');
            return processedOption;
        }).join(', ');
    };

    const renderQuestion = (question, index) => {
        switch (question.type) {
            case 'trắc nghiệm':
            case 'điền khuyết':
            case 'nghe':
                return (
                    <div className="mt-4 p-4 border border-stone-200 rounded-md text-xs dark:border-stone-700" key={index}>
                        <p><strong>Question {index + 1}:</strong> {question.titleQuestion || 'N/A'}</p>
                        <p><strong>Options:</strong> <span dangerouslySetInnerHTML={{ __html: processOptions(question.options || []) }} /></p>
                        <p><strong>Answer:</strong> {question.answer || 'N/A'}</p>
                    </div>
                );
            case 'đục lỗ':
                return (
                    <div className="mt-4 p-4 border border-stone-200 rounded-md text-xs dark:border-stone-700" key={index}>
                        <p><strong>Question {index + 1}:</strong> {question.titleQuestion || 'N/A'}</p>
                        <p><strong>Options Documentation:</strong></p>
                        {question.optionsDoc?.map((optionList, listIndex) => (
                            <div key={listIndex}>
                                <strong>Set {listIndex + 1}:</strong> {optionList.join(', ')}
                            </div>
                        )) || 'N/A'}
                        <p><strong>Answer Documentation:</strong></p>
                        {question.answerDoc?.map((answer, answerIndex) => (
                            <div key={answerIndex}>
                                <strong>Answer {answerIndex + 1}:</strong> {answer}
                            </div>
                        )) || 'N/A'}
                    </div>
                );
            case 'trọng âm':
                return (
                    <div className="mt-4 p-4 border border-stone-200 rounded-md text-xs dark:border-stone-700" key={index}>
                        <p><strong>Question {index + 1}:</strong> Choose the answer that has a different stress from the rest.</p>
                        <p><strong>Options:</strong> <span dangerouslySetInnerHTML={{ __html: processOptions(question.options || []) }} /></p>
                        <p><strong>Answer:</strong> {question.answer || 'N/A'}</p>
                    </div>
                );
            case 'shortAnswer':
                return (
                    <div className="mt-4 p-4 border border-stone-200 rounded-md text-xs dark:border-stone-700" key={index}>
                        <p><strong>Question {index + 1}:</strong> {question.titleQuestion || 'N/A'}</p>
                        <p><strong>Answer:</strong> {question.answer || 'N/A'}</p>
                    </div>
                );
            default:
                return <p className="text-xs dark:text-white" key={index}>Unknown question type.</p>;
        }
    };

    const getStatusBackground = (status) => {
        switch (status) {
            case 'approved':
                return 'px-2 py-1 rounded-lg bg-green-500 dark:bg-green-600';
            case 'pending':
                return 'px-2 py-1 rounded-lg bg-yellow-500 dark:bg-yellow-600';
            case 'rejected':
                return 'px-2 py-1 rounded-lg bg-red-500 dark:bg-red-600';
            default:
                return 'px-2 py-1 rounded-lg bg-stone-300 dark:bg-stone-600';
        }
    };

    const examId = exam._id?.$oid || 'N/A'; // Use optional chaining here

    return (
        <div className="border bg-white rounded-lg p-4 mt-4 text-xs dark:bg-stone-800 dark:border-stone-700">
            <h2 className="text-lg dark:text-white font-semibold mb-4 border-b pb-2 dark:border-stone-600">
                Exam Title: {exam.titleExam || 'Untitled Exam'}
            </h2>
            <p className="text-xs dark:text-white mb-2"><strong>Status:</strong> <span className={`text-white ${getStatusBackground(exam.status)}`}>{exam.status || 'N/A'}</span></p>
            <p className="text-xs dark:text-white mb-2"><strong>Class:</strong> {exam.classExam || 'N/A'}</p>
            <p className="text-xs dark:text-white mb-2"><strong>Type:</strong> {exam.time || 'N/A'}</p>
            <p className="text-xs dark:text-white mb-2"><strong>Description:</strong> {exam.description || 'N/A'}</p>

            <div className="flex space-x-4">
                <button
                    onClick={() => setShowDetails(prev => !prev)}
                    className="bg-blue-500 text-white p-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center text-xs"
                >
                    {showDetails ? (
                        <>
                            <MdVisibilityOff className="mr-2" />
                            Hide Details
                        </>
                    ) : (
                        <>
                            <MdVisibility className="mr-2" />
                            Show Details
                        </>
                    )}
                </button>
            </div>

            {showDetails && (
                <div className="bg-stone-100 p-4 mt-4 rounded-md text-xs dark:bg-stone-600">
                    <h3 className="text-lg font-semibold mb-2 dark:text-white">
                        <MdQuestionAnswer className="inline-block mr-2" />
                        Chapters:
                    </h3>
                    {Array.isArray(exam.chapters) && exam.chapters.length > 0 ? (
                        exam.chapters.map((chapter, chapterIndex) => (
                            <div key={chapter._id?.$oid || chapter.chapterID || 'N/A'} className="border-t border-stone-300 pt-2 mt-2 dark:border-stone-600">
                                <h4 className="text-xs font-bold mb-2 dark:text-white">
                                    <MdDescription className="inline-block mr-2 dark:text-white" />
                                    {chapter.titleChapter || 'Untitled Chapter'}
                                </h4>
                                <p className="mb-2 dark:text-white"><strong>Score:</strong> {chapter.chapterScore || 'N/A'}</p>
                                <div className="mb-4 dark:text-white">
                                    {Array.isArray(chapter.questions) && chapter.questions.length > 0 ? (
                                        chapter.questions.map((question, questionIndex) => (
                                            <div key={question._id?.$oid || question.questionID || 'N/A'} className="mb-4">
                                                {renderQuestion(question, questionIndex)}
                                            </div>
                                        ))
                                    ) : (
                                        <p className=" dark:text-white">No questions available.</p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className=" dark:text-white">No chapters available.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default ExamDetails;
