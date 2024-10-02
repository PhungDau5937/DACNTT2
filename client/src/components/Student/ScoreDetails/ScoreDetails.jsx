import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ScoreDetails = () => {
  const { classId } = useParams();
  const [scores, setScores] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const studentId = localStorage.getItem('username');

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}student/getscores/${studentId}/${classId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setScores(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, [studentId, classId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // Helper function to round score
  const roundToNearest025 = (num) => {
    return Math.round(num * 40) / 40;
  };

  const oralScores = scores.scores.oral.map((score, index) => ({
    label: `Oral ${index + 1}`,
    score: roundToNearest025(score),
  }));

  const fifteenMinutesScores = scores.scores.fifteenMinutes.map((score, index) => ({
    label: `15 Minutes ${index + 1}`,
    score: roundToNearest025(score),
  }));

  const chartData = {
    labels: [
      ...oralScores.map(score => score.label),
      ...fifteenMinutesScores.map(score => score.label),
      'Mid Term',
      'Final Exam',
    ],
    datasets: [
      {
        label: 'Scores',
        data: [
          ...oralScores.map(score => score.score),
          ...fifteenMinutesScores.map(score => score.score),
          roundToNearest025(scores.scores.midTerm),
          scores.scores.finalExam !== null ? roundToNearest025(scores.scores.finalExam) : 0,
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Student Scores',
      },
    },
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow rounded-lg min-h-96 dark:bg-stone-800">
      <h1 className="text-2xl font-bold dark:text-white">Scores for Class</h1>
      {scores ? (
        <div>
          <div className="mt-6">
            <Bar data={chartData} options={chartOptions} />
          </div>
          <div className="mt-6">
            <p className="text-lg dark:text-white">Average Score: {roundToNearest025(scores.averageScore)}</p>
          </div>
        </div>
      ) : (
        <p className="text-lg dark:text-white">No scores available for this class.</p>
      )}
    </div>
  );
};

export default ScoreDetails;
