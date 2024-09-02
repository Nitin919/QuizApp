const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserDetails
} = require('../controllers/userController');
const userAuthMiddleware = require('../middleware/userAuthMiddleware');

// Route to register a new user
router.post('/signup', registerUser); // POST /api/users/signup

// Route to login a user
router.post('/login', loginUser); // POST /api/users/login

// Route to get user details (protected route)
router.get('/profile', userAuthMiddleware, getUserDetails); // GET /api/users/profile

module.exports = router;
