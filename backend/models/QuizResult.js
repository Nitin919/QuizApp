const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  questions: [
    {
      question: {
        type: String,
        required: true,
        trim: true,  // Trim whitespace for consistency
      },
      correctAnswer: {
        type: String,
        required: true,
        trim: true,  // Trim whitespace for consistency
      },
      userAnswer: {
        type: String,
        default: null, // userAnswer is optional, defaulting to null if not provided
        trim: true,  // Trim whitespace for consistency
      },
    },
  ],
  score: {
    type: Number,
    required: true,
    min: 0, // Ensures score is non-negative
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps automatically
});

// Virtual field to calculate the total number of correct answers
QuizSchema.virtual('correctAnswersCount').get(function () {
  return this.questions.reduce((count, question) => {
    return count + (question.correctAnswer === question.userAnswer ? 1 : 0);
  }, 0);
});

// Ensure virtual fields are included when converting to JSON or Object
QuizSchema.set('toJSON', { virtuals: true });
QuizSchema.set('toObject', { virtuals: true });

// Indexing for better query performance
QuizSchema.index({ user: 1, score: -1 });

module.exports = mongoose.model('Quiz', QuizSchema);
