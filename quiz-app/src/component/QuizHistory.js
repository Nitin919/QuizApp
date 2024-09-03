import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const categoryMap = {
  "9": "General Knowledge",
  "12": "Music",
  "17": "Science",
  "21": "Sports",
  "23": "History",
  // Add more mappings as needed
};

const QuizHistory = () => {
  const [quizHistory, setQuizHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizHistory = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('User is not authenticated');
        }

        const response = await fetch(`${backendUrl}/app/api/quiz/history`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 401) {
          const data = await response.json();
          if (data.message === 'Token expired') {
            alert('Your session has expired. Please log in again.');
            localStorage.removeItem('token'); // Clear the expired token
            navigate('/login'); // Redirect to login page
          } else {
            navigate('/login');
          }
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch quiz history');
        }

        const data = await response.json();
        setQuizHistory(data.quizHistory || []);
      } catch (error) {
        console.error('Error fetching quiz history:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizHistory();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-xl font-bold">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-xl font-bold text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (quizHistory.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-xl font-bold">No quiz history available.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <h1 className="text-3xl font-bold mb-4 text-white">Quiz History</h1>
      <div className="w-full max-w-2xl bg-gray-800 bg-opacity-80 text-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-700 text-sm md:text-base">
              <th className="p-2 md:p-4 border-b">Score</th>
              <th className="p-2 md:p-4 border-b">Category</th>
              <th className="p-2 md:p-4 border-b">Difficulty</th>
              <th className="p-2 md:p-4 border-b">Date</th>
            </tr>
          </thead>
          <tbody>
            {quizHistory.map((quiz, index) => (
              <tr key={index} className="border-b">
                <td className="p-2 md:p-4">{quiz.score}</td>
                <td className="p-2 md:p-4">{categoryMap[quiz.category] || quiz.category}</td>
                <td className="p-2 md:p-4">{quiz.difficulty}</td>
                <td className="p-2 md:p-4">{new Date(quiz.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={() => navigate('/')}
        className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
      >
        Back to Home
      </button>
    </div>
  );
};

export default QuizHistory;
