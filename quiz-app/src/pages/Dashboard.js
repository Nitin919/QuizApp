// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);

  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token if needed
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('User data fetched:', data);
      // Handle user data
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {userData ? (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-xl font-semibold mb-2">Welcome, {userData.username}</h2>
          <p className="mb-4">Total Score: {userData.totalScore}</p>
          <p className="mb-4">Quiz History:</p>
          <ul className="list-disc pl-5">
            {userData.quizHistory.map((quiz, index) => (
              <li key={index}>
                <strong>Category:</strong> {quiz.category} <br />
                <strong>Difficulty:</strong> {quiz.difficulty} <br />
                <strong>Score:</strong> {quiz.score} <br />
                <strong>Date:</strong> {new Date(quiz.date).toLocaleDateString()} <br />
              </li>
            ))}
          </ul>
          <Link to="/quiz" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">
            Back to Quiz
          </Link>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Dashboard;
