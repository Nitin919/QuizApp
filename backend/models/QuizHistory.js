const mongoose = require('mongoose');

const quizHistorySchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  category: { 
    type: String, 
    required: true, 
    index: true 
  },
  difficulty: { 
    type: String, 
    required: true 
  },
  score: { 
    type: Number, 
    required: true 
  },
  questions: [{ 
    question: { 
      type: String, 
      required: true 
    }, 
    selectedAnswer: { 
      type: String, 
      required: true 
    }, 
    correctAnswer: { 
      type: String, 
      required: true 
    } 
  }],
  date: { 
    type: Date, 
    default: Date.now, 
    index: true 
  }
});

// Ensure indexes are created for faster querying
quizHistorySchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('QuizHistory', quizHistorySchema);
