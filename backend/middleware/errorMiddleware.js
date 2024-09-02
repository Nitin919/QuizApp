const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack);

  // Set default status code to 500 if not set
  const statusCode = err.statusCode || 500;

  // Determine the environment
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Prepare the response object
  const response = {
    message: err.message || 'Something went wrong',
  };

  // Include the stack trace and additional details only in development mode
  if (isDevelopment) {
    response.stack = err.stack;
    if (err.details) {
      response.details = err.details;
    }
  }

  // Send the response
  res.status(statusCode).json(response);
};

module.exports = errorMiddleware;
