const express = require('express');
const router = express.Router();
const {
    fetchQuizQuestions,
    saveQuizResult,
    getTotalScore,
    getQuizHistory
} = require('../controllers/quizController');
const quizAuthMiddleware = require('../middleware/quizAuthMiddleware');

// Route to get quiz questions (open to all users)
router.get('/questions', fetchQuizQuestions);

// Route to submit quiz results (protected, requires authentication)
router.post('/results', quizAuthMiddleware, saveQuizResult);

// Route to get the total score for a user (protected, requires authentication)
router.get('/score', quizAuthMiddleware, getTotalScore);

// Route to get quiz history for a user (protected, requires authentication)
router.get('/history', quizAuthMiddleware, getQuizHistory);

module.exports = router;
