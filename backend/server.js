const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
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


// Configure CORS
app.use(cors({
  origin: 'https://quiz-app-brown-two.vercel.app', // Allow only this domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allow these headers
}));
// Initialize Express application
const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON requests

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

connectDB();

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

// API routes
app.use('/api/users', userRoutes);
app.use('/api/quiz', quizRoutes);

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
