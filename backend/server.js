const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const errorMiddleware = require('./middleware/errorMiddleware');
const userRoutes = require('./routes/userRoutes');
const quizRoutes = require('./routes/quizRoutes');

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error(`FATAL ERROR: Missing the following environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

// Initialize Express application
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON requests

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

connectDB();

// API routes
app.use('/api/users', userRoutes);
app.use('/api/quiz', quizRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../quiz-app/build')));

// Catch-all route to serve React's index.html for non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../quiz-app/build', 'index.html'));
});

// Error handling middleware
app.use(errorMiddleware);

// Graceful shutdown
const shutdown = () => {
  console.log('SIGINT signal received: closing HTTP server');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
};

// Handle graceful shutdown on SIGINT and SIGTERM
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
