const User = require('../models/User');
const QuizHistory = require('../models/QuizHistory');
const mongoose = require('mongoose');

// Fetch quiz questions
const fetchQuizQuestions = async (req, res) => {
  try {
    const questions = [
      {
        question: "What is the capital of France?",
        correctAnswer: "Paris",
        options: ["Paris", "London", "Berlin", "Rome"],
      },
      // Add more questions here
    ];
    res.status(200).json({ results: questions });
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    res.status(500).json({ message: 'Error fetching quiz questions', error: error.message });
  }
};

// Save quiz results
const saveQuizResult = async (req, res) => {
  try {
    const { score, category, difficulty, questions } = req.body;
    const userId = req.user?.id;

    console.log('Saving quiz result for user ID:', userId);

    if (!userId || !score || !category || !difficulty || !Array.isArray(questions)) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    // Correct way to instantiate an ObjectId
    const quizHistory = new QuizHistory({
      userId: new mongoose.Types.ObjectId(userId), // Use 'new' to create an ObjectId instance
      score,
      category,
      difficulty,
      questions,
    });

    await quizHistory.save();
    console.log('Quiz result saved successfully:', quizHistory);

    res.status(201).json({ message: 'Quiz result saved successfully' });
  } catch (error) {
    console.error('Error saving quiz results:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};






// Get quiz history for a user
const getQuizHistory = async (req, res) => {
  try {
    const userId = req.user?._id;

    console.log('Fetching quiz history for user ID:', userId);

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ message: 'User not authenticated or invalid user ID' });
    }

    const quizHistory = await QuizHistory.find({ userId }).sort({ date: -1 });

    if (quizHistory.length === 0) {
      console.log('No quiz history found for user ID:', userId);
      return res.status(404).json({ message: 'No quiz history found' });
    }

    res.status(200).json({ quizHistory });
  } catch (error) {
    console.error('Error fetching quiz history:', error);
    res.status(500).json({ message: 'Failed to fetch quiz history', error: error.message });
  }
};


// Get total score for a user
const getTotalScore = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ message: 'User not authenticated or invalid user ID' });
    }

    const quizHistory = await QuizHistory.find({ userId });

    if (quizHistory.length === 0) {
      return res.status(404).json({ message: 'No quiz history found' });
    }

    const totalScore = quizHistory.reduce((acc, quiz) => acc + quiz.score, 0);

    res.status(200).json({ totalScore });
  } catch (error) {
    console.error('Error fetching total score:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { fetchQuizQuestions, saveQuizResult, getQuizHistory, getTotalScore };