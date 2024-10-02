import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ExamSubmissionDetails() {
    const  {examSubmissionId}  = useParams();
    const [approvedExams, setApprovedExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApprovedExams = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}head/approvedexams/${examSubmissionId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setApprovedExams(data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchApprovedExams();
    }, [examSubmissionId]);

    const handleApproval = async (examId, status) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}head/approvedexams/${examId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const updatedExam = await response.json();
            setApprovedExams(approvedExams.map(exam => exam._id === updatedExam._id ? updatedExam : exam));
        } catch (error) {
            console.error('Error updating exam status:', error);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <h1>Exam Submission Details</h1>
            {approvedExams.length === 0 ? (
                <p>No approved exams found.</p>
            ) : (
                approvedExams.map((exam) => (
                    <div key={exam._id}>
                        <h2>{exam.titleExam}</h2>
                        <p>Status: {exam.status}</p>
                        <p>Class: {exam.classExam}</p>
                        <p>Time: {exam.time}</p>
                        <p>Score: {exam.score}</p>
                        <p>Description: {exam.description}</p>
                        <p>Chapters: {exam.chapters.join(', ')}</p>

                        {exam.status === 'pending' && (
                            <div>
                                <button onClick={() => handleApproval(exam._id, 'approved')}>Approve</button>
                                <button onClick={() => handleApproval(exam._id, 'rejected')}>Reject</button>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

export default ExamSubmissionDetails;
