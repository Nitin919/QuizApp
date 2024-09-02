const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// Register a new user
const registerUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log(`Registration attempt for username: ${username}`);

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.warn(`Registration failed - User already exists: ${username}`);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create and save the new user
    const user = new User({ username, password });
    await user.save();

    console.log(`New user created: ${username} (ID: ${user._id})`);

    // Return the user info and JWT token
    res.status(201).json({
      _id: user._id,
      username: user.username,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Authenticate user & get token
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  console.log(`Login attempt with username: ${username}`);

  // Validate request data
  if (!username || !password) {
    console.warn('Login failed - Missing username or password');
    return res.status(400).json({ message: 'Please provide both username and password' });
  }

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      console.warn(`Login failed - User not found for username: ${username}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log(`User found for login: ${username} (ID: ${user._id})`);

    // Check if the password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.warn(`Login failed - Incorrect password for user: ${username}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate and return the JWT token
    const token = generateToken(user._id);
    
    res.status(200).json({
      _id: user._id,
      username: user.username,
      token,
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user profile details
const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      console.warn(`Get user details failed - User not found: ${req.user._id}`);
      return res.status(404).json({ message: 'User not found' });
    }

 

    res.json({
      _id: user._id,
      username: user.username,
    });
  } catch (error) {
    console.error('Get user details error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserDetails,
};
