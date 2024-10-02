import React, { useState } from 'react';

function ExamDetails({ exam, onApproval }) {
    const [showDetails, setShowDetails] = useState(false); // State to manage chapter details visibility

    if (!exam) {
        return <p>No exam data available.</p>;
    }

    const approveExam = () => onApproval(exam._id, 'approved');
    const rejectExam = () => onApproval(exam._id, 'rejected');

    // Function to process the options and return HTML with bold text
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
                    <div className="mb-4 p-4 border border-stone-200 rounded-md">
                        <p><strong>Question {index + 1}:</strong> {question.titleQuestion || 'N/A'}</p>
                        <p><strong>Options:</strong> <span dangerouslySetInnerHTML={{ __html: processOptions(question.options || []) }} /></p>
                        <p><strong>Answer:</strong> {question.answer || 'N/A'}</p>
                    </div>
                );
            case 'đục lỗ':
                return (
                    <div className="mb-4 p-4 border border-stone-200 rounded-md">
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
                    <div className="mb-4 p-4 border border-stone-200 rounded-md">
                        <p><strong>Question {index + 1}:</strong> Choose the answer that has a different stress from the rest.</p>
                        <p><strong>Options:</strong> <span dangerouslySetInnerHTML={{ __html: processOptions(question.options || []) }} /></p>
                        <p><strong>Answer:</strong> {question.answer || 'N/A'}</p>
                    </div>
                );
            case 'shortAnswer':
                return (
                    <div className="mb-4 p-4 border border-stone-200 rounded-md">
                        <p><strong>Question {index + 1}:</strong> {question.titleQuestion || 'N/A'}</p>
                        <p><strong>Answer:</strong> {question.answer || 'N/A'}</p>
                    </div>
                );
            default:
                return <p>Unknown question type.</p>;
        }
    };

    const examId = exam._id.$oid || 'N/A'; // Access directly as it's a string

    return (
        <div className="bg-white shadow-md rounded-lg p-6 mb-4">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">{exam.titleExam || 'Untitled Exam'}</h2>
            <p className="text-stone-700 mb-2"><strong>Status:</strong> {exam.status || 'N/A'}</p>
            <p className="text-stone-700 mb-2"><strong>Class:</strong> {exam.classExam || 'N/A'}</p>
            <p className="text-stone-700 mb-2"><strong>Type:</strong> {exam.time || 'N/A'}</p>
            <p className="text-stone-700 mb-2"><strong>Teacher ID:</strong> {exam.teacher ? `${exam.teacher.username}` : 'N/A'}</p>
            <p className="text-stone-700 mb-2"><strong>Teacher Name:</strong> {exam.teacher ? `${exam.teacher.lastName} ${exam.teacher.firstName}` : 'N/A'}</p>
            <p className="text-stone-700 mb-4"><strong>Description:</strong> {exam.description || 'N/A'}</p>

            <div className="flex space-x-4 mb-4">
                {/* Button to toggle chapters details */}
                <button 
                    onClick={() => setShowDetails(prev => !prev)} 
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    {showDetails ? 'Hide Details' : 'Show Details'}
                </button>

                {exam.status === 'pending' && (
                    <div className="flex space-x-4">
                        <button
                            onClick={approveExam}
                            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                        >
                            Approve
                        </button>
                        <button
                            onClick={rejectExam}
                            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                        >
                            Reject
                        </button>
                    </div>
                )}
            </div>

            {showDetails && (
                <div className="bg-stone-100 p-4 rounded-md shadow-inner">
                    <h3 className="text-lg font-semibold mb-2">Chapters:</h3>
                    {Array.isArray(exam.chapters) && exam.chapters.length > 0 ? (
                        exam.chapters.map((chapter, chapterIndex) => (
                            <div key={chapter._id.$oid || chapter.chapterID || 'N/A'} className="border-t border-stone-300 pt-2 mt-2">
                                <h4 className="text-lg font-bold mb-2">{chapter.titleChapter || 'Untitled Chapter'}</h4>
                                <p className="text-stone-700 mb-2"><strong>Score:</strong> {chapter.chapterScore || 'N/A'}</p>
                                <div className="mb-4">
                                    {Array.isArray(chapter.questions) && chapter.questions.length > 0 ? (
                                        chapter.questions.map((question, questionIndex) => (
                                            <div key={question._id.$oid || question.questionID || 'N/A'} className="mb-4">
                                                {renderQuestion(question, questionIndex)}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-stone-500">No questions available.</p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-stone-500">No chapters available.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default ExamDetails;