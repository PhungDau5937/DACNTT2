import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function PracticeTests() {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchDate, setSearchDate] = useState('');

    useEffect(() => {
        async function fetchExams() {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}student/publicexams`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setExams(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchExams();
    }, []);

    const handleSearchTerm = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };


    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="flex justify-center items-center h-screen">Error: {error}</div>;

    // Lọc kỳ thi theo từ khóa tìm kiếm và ngày
    const filteredExams = exams.filter(exam =>
        (exam.titleExam.toLowerCase().includes(searchTerm) || 
         exam.description.toLowerCase().includes(searchTerm)) &&
        (searchDate ? new Date(exam.date).toISOString().split('T')[0] === searchDate : true)
    );

    return (
        <div>
            <div className="container mx-auto p-6 bg-white shadow rounded-lg min-h-96 dark:bg-stone-800">
                <h1 className="text-4xl font-extrabold text-center text-stone-800 dark:text-white mb-8">Public Practice Tests</h1>

                {/* Thanh tìm kiếm */}
                <div className="flex flex-col md:flex-row justify-between mb-6">
                    <input
                        type="text"
                        placeholder="Search exams..."
                        value={searchTerm}
                        onChange={handleSearchTerm}
                        className="p-2 border rounded-lg shadow-sm dark:bg-stone-700 dark:text-white mb-4 md:mb-0 md:w-full"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8">
                    {filteredExams.map(exam => (
                        <div key={exam._id} className="bg-white dark:bg-stone-800 dark:text-white p-6 text-sm rounded-lg border hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:scale-105">
                            <h2 className="text-3xl font-bold mb-2">{exam.titleExam}</h2>
                            <p className="text-stone-600 dark:text-stone-300 mb-2"><span className="font-semibold">Status:</span> {exam.status}</p>
                            <p className="text-stone-600 dark:text-stone-300 mb-2"><span className="font-semibold">Class:</span> {exam.classExam}</p>
                            <p className="text-stone-600 dark:text-stone-300 mb-2"><span className="font-semibold">Time:</span> {exam.time}</p>                            <p className="text-stone-600 dark:text-stone-300 mb-4"><span className="font-semibold">Description:</span> {exam.description}</p>
                            <Link
                                to={`/practicetests/${exam._id}`}
                                className="inline-block bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                            >
                                Go to Exam
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PracticeTests;
