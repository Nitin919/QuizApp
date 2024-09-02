const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Function to hash a password
const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    console.error('Error hashing password:', error.message);
    throw new Error('Failed to hash password');
  }
};

// Function to compare a candidate password with a stored hashed password
const comparePassword = async (candidatePassword, hashedPassword) => {
  try {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  } catch (error) {
    console.error('Error comparing passwords:', error.message);
    throw new Error('Failed to compare passwords');
  }
};

// Function to generate a JWT token
const generateToken = (user) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not set');
    }

    return jwt.sign(
      { _id: user._id, username: user.username }, // Payload data
      process.env.JWT_SECRET, // Secret key
      { expiresIn: '30d' } // Token expiration
    );
  } catch (error) {
    console.error('Error generating token:', error.message);
    throw new Error('Failed to generate token');
  }
};

module.exports = { hashPassword, comparePassword, generateToken };
