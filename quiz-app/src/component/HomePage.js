import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QuizHistory from './QuizHistory';

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [showQuizHistory, setShowQuizHistory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://opentdb.com/api_category.php');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data.trivia_categories);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories. Please try again later.');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleDifficultyChange = (event) => {
    setSelectedDifficulty(event.target.value);
  };

  const handleStartQuiz = () => {
    if (selectedCategory && selectedDifficulty) {
      navigate(`/quiz?category=${selectedCategory}&difficulty=${selectedDifficulty}`);
    } else {
      alert('Please select both a category and difficulty level!');
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  const toggleQuizHistory = () => {
    setShowQuizHistory(prevState => !prevState);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white">Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center text-white p-6 md:p-10"
         style={{ backgroundImage: "url('../../bg.png')" }}>
      <div className="bg-black bg-opacity-60 p-8 md:p-16 rounded-lg shadow-2xl max-w-3xl w-full">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-center leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Welcome to the Quiz App!
        </h1>
        <p className="text-lg md:text-2xl text-gray-300 mb-8 text-center">
          Choose your favorite quiz category and difficulty level to get started!
        </p>
        <div className="space-y-6">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full p-4 rounded-lg text-gray-800 bg-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300"
            aria-label="Select a category"
          >
            <option value="" disabled>Select a Category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            value={selectedDifficulty}
            onChange={handleDifficultyChange}
            className="w-full p-4 rounded-lg text-gray-800 bg-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300"
            aria-label="Select difficulty"
          >
            <option value="" disabled>Select Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <button
          onClick={handleStartQuiz}
          disabled={!selectedCategory || !selectedDifficulty}
          className={`w-full mt-8 bg-blue-600 text-white font-bold py-4 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300 ${(!selectedCategory || !selectedDifficulty) && 'opacity-50 cursor-not-allowed'}`}
        >
          Start Quiz
        </button>
        <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4 mt-6">
          <button
            onClick={handleLogin}
            className="w-full md:w-auto bg-gray-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-500 transition duration-300"
          >
            Login
          </button>
          <button
            onClick={handleSignup}
            className="w-full md:w-auto bg-gray-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-500 transition duration-300"
          >
            Signup
          </button>
        </div>
        <button
          onClick={toggleQuizHistory}
          aria-pressed={showQuizHistory}
          className="w-full mt-8 bg-green-600 text-white font-bold py-4 rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition duration-300"
        >
          {showQuizHistory ? 'Hide Quiz History' : 'View Quiz History'}
        </button>
        {showQuizHistory && (
          <div className="w-full mt-10">
            <QuizHistory />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
