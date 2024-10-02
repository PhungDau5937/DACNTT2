import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ExamDetails from '../../components/Head/ExamSubmissionDetails/ExamDetails';

function ExamSubmissionDetails() {
    const { examSubmissionId } = useParams();
    const [approvedExams, setApprovedExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchApprovedExams = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}head/approvedexams/${examSubmissionId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Fetched exam data:', data); // Debugging line
            setApprovedExams(Array.isArray(data) ? data : [data]); // Ensure data is an array
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApprovedExams();
    }, [examSubmissionId]);

    const handleApproval = async (examId, status) => {
        console.log('Exam ID:', examId);
        console.log('Status:', status);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}head/approvedexams/${examId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });
            console.log('Approval response:', examId); // Debugging line
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            fetchApprovedExams();

            const updatedExam = await response.json();
            setApprovedExams(approvedExams.map(exam => exam._id === updatedExam._id ? updatedExam : exam));
        } catch (error) {
            console.error('Error updating exam status:', error);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const pendingExams = approvedExams.filter(exam => exam.status === 'pending');
    const rejectedExams = approvedExams.filter(exam => exam.status === 'rejected');
    const acceptedExams = approvedExams.filter(exam => exam.status === 'approved');

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-4">Exam Submission Details</h1>

            {pendingExams.length > 0 ? (
                <>
                    <h2 className="text-xl font-semibold mb-2">Pending Exams</h2>
                    {pendingExams.map((exam) => (
                        <ExamDetails key={exam._id} exam={exam} onApproval={handleApproval} />
                    ))}
                </>
            ) : (
                <p className="text-center text-gray-500">No pending exams found.</p>
            )}

            {rejectedExams.length > 0 && (
                <>
                    <h2 className="text-xl font-semibold mb-2">Rejected Exams</h2>
                    {rejectedExams.map((exam) => (
                        <ExamDetails key={exam._id} exam={exam} onApproval={handleApproval} />
                    ))}
                </>
            )}

            {acceptedExams.length > 0 && (
                <>
                    <h2 className="text-xl font-semibold mb-2">Accepted Exams</h2>
                    {acceptedExams.map((exam) => (
                        <ExamDetails key={exam._id} exam={exam} onApproval={handleApproval} />
                    ))}
                </>
            )}
        </div>
    );
}

export default ExamSubmissionDetails;
