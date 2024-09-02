const jwt = require('jsonwebtoken');

// Function to generate a JWT token
const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  return jwt.sign(
    { id: user._id, username: user.username }, // Payload
    process.env.JWT_SECRET, // Secret key
    { expiresIn: '1h' } // Token expiration time
  );
};

module.exports = generateToken;
