const jwt = require('jsonwebtoken');
const User = require('../models/User');

const quizAuthMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];


  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded successfully:', decoded);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      console.error('User not found for ID:', decoded.id);
      return res.status(401).json({ message: 'User not found, authorization denied' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    console.error('Token verification failed:', err);
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = quizAuthMiddleware;
