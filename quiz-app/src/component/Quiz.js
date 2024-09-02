import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import he from 'he';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [userAnswers, setUserAnswers] = useState([]); 
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const fetchQuestions = async (apiUrl) => {
    try {
      const cachedQuestions = localStorage.getItem(apiUrl);
      if (cachedQuestions) {
        return JSON.parse(cachedQuestions);
      }

      const response = await fetch(apiUrl);
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }

      const data = await response.json();
      localStorage.setItem(apiUrl, JSON.stringify(data));
      return data;
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get('category');
    const difficulty = queryParams.get('difficulty');
  
    setSelectedCategory(category || '');
    setSelectedDifficulty(difficulty || '');

    const categoryMap = {
      general: 9,
      science: 17,
      history: 23,
      sports: 21,
      music: 12,
    };

    const categoryId = categoryMap[category];
    let apiUrl = 'https://opentdb.com/api.php?amount=10&type=multiple';
    if (categoryId) {
      apiUrl += `&category=${categoryId}`;
    }
    if (difficulty) {
      apiUrl += `&difficulty=${difficulty}`;
    }

    fetchQuestions(apiUrl)
      .then(data => {
        if (data.results) {
          const formattedQuestions = data.results.map((questionItem) => {
            const answerOptions = [
              ...questionItem.incorrect_answers,
              questionItem.correct_answer,
            ].sort(() => Math.random() - 0.5);

            return {
              question: he.decode(questionItem.question),
              answerOptions: answerOptions.map(answer => he.decode(answer)),
              correctAnswer: he.decode(questionItem.correct_answer),
            };
          });
          setQuestions(formattedQuestions);
        } else {
          setQuestions([]);
        }
      })
      .catch(error => {
        setQuestions([]);
        console.error('Error fetching questions:', error);
      })
      .finally(() => setLoading(false));
  }, [location.search]);

  useEffect(() => {
    if (timeLeft > 0 && !showScore) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleNextQuestion();
    }
  }, [timeLeft, showScore]);

  const handleAnswerOptionClick = (answer) => {
    if (selectedAnswer === null) {
      setSelectedAnswer(answer);
      setUserAnswers(prevAnswers => [
        ...prevAnswers,
        {
          question: questions[currentQuestionIndex].question,
          selectedAnswer: answer,
          correctAnswer: questions[currentQuestionIndex].correctAnswer,
        },
      ]);
  
      if (answer === questions[currentQuestionIndex].correctAnswer) {
        setScore(prevScore => prevScore + 1);
        setFeedback('Correct!');
      } else {
        setFeedback(`Incorrect! The correct answer was: ${questions[currentQuestionIndex].correctAnswer}`);
      }
    }
  };
  

  const handleNextQuestion = () => {
    setTimeout(() => {
      const nextQuestion = currentQuestionIndex + 1;
      setTimeLeft(10);
      setSelectedAnswer(null);
      setFeedback(null);

      if (nextQuestion < questions.length) {
        setCurrentQuestionIndex(nextQuestion);
      } else {
        setShowScore(true);
      }
    }, 1000);
  };
  const calculateScore = () => {
    let score = 0;
  
    userAnswers.forEach(answer => {
      if (answer.selectedAnswer === answer.correctAnswer) {
        score += 1; // Increment score for each correct answer
      }
    });
  
    return score;
  };



  const handleSubmitQuiz = async () => {
    // Calculate score from userAnswers
    const calculatedScore = calculateScore(userAnswers);

    const userToken = localStorage.getItem('token');

    if (!userToken) {
      alert('Your session has expired. Please log in again.');
      navigate('/login');
      return;
    }

    const payload = {
      score: calculatedScore,
      category: selectedCategory || '24', // Use selected category
      difficulty: selectedDifficulty || 'hard', // Use selected difficulty
      questions: userAnswers,  // Use the userAnswers array
    };

    console.log("Payload being sent to the server:", payload);
    console.log("Token being used:", userToken);

    try {
      const response = await fetch('http://localhost:5000/api/quiz/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        const data = await response.json();
        if (data.message === 'Token expired') {
          alert('Your session has expired. Please log in again.');
          localStorage.removeItem('token'); // Clear the expired token
          navigate('/login'); // Redirect to login page
          return;
        } else {
          throw new Error('Unauthorized');
        }
      }

      if (!response.ok) {
        throw new Error('Failed to save quiz results');
      }

      console.log('Quiz result saved successfully');
    } catch (error) {
      console.error('Error saving quiz result:', error);
    }
  };
  
  
  const handlePlayAgain = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowScore(false);
    setTimeLeft(10);
    setFeedback(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <div className="text-2xl font-bold">Loading questions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <div className="text-2xl font-bold text-red-500">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Retry
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <div className="text-2xl font-bold">No questions available.</div>
        <button
          onClick={() => navigate('/')}
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center text-white p-6 md:p-10"
      style={{ backgroundImage: "url('../../bg.png')" }}
    >
      {showScore ? (
        <div className="text-center bg-gray-900 bg-opacity-90 p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Your Score: {score} / {questions.length}</h1>
          <button
            onClick={handlePlayAgain}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Play Again
          </button>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Back to Home
          </button>
        </div>
      ) : (
        <div className="w-full max-w-xl bg-gray-900 bg-opacity-90 p-8 rounded-lg shadow-md">
          <button
            onClick={() => navigate('/')}
            className="mb-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
          >
            Back to Home
          </button>
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg md:text-xl font-semibold">Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span className="text-lg md:text-xl font-semibold text-red-500">Time Left: {timeLeft} seconds</span>
          </div>
          <h2 className="text-xl font-semibold mb-4">
            {questions[currentQuestionIndex].question}
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {questions[currentQuestionIndex].answerOptions.map((answer, index) => (
              <button
                key={index}
                onClick={() => handleAnswerOptionClick(answer)}
                className={`py-2 px-4 rounded-lg border
                  ${selectedAnswer === answer
                    ? (answer === questions[currentQuestionIndex].correctAnswer
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white')
                    : 'bg-gray-200 hover:bg-gray-300'}
                `}
                disabled={selectedAnswer !== null}
              >
                {answer}
              </button>
            ))}
          </div>
          {feedback && (
            <div className="mt-4 text-lg font-semibold">
              {feedback}
            </div>
          )}
          {selectedAnswer && (
            <>
              <button
                onClick={handleNextQuestion}
                className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Next Question
              </button>
              {currentQuestionIndex === questions.length - 1 && (
                <button
                  onClick={handleSubmitQuiz}
                  className="mt-6 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
                >
                  Submit Quiz
                </button>
              )}
            </>
          )}
        </div>
      )}

      {submitting && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
