const { ValidationError } = require("express-validation");
const AppError = require("../utils/errors/app-error.js");
const { StatusCodes } = require("http-status-codes");
const { ErrorResponse } = require("../utils/common");


// General error handler
const errorHandler = (err, req, res, next) => {
  // Convert ValidationError to ApiError

  if (err instanceof ValidationError) {
     ErrorResponse.message = err.error || "Validation error"
     err = new AppError(err.details, err.statusCode || 400);
  }

  // if (error.name === 'SequelizeValidationError') {
  //   const explanation = error.errors.map((err) => err.message);
  //   throw new AppError(explanation.join(', '), StatusCodes.BAD_REQUEST);
  // }

  // Ensure error is an instance of ApiError
  if (!(err instanceof AppError)) {
    err = new AppError(err.message || "Internal Server Error",err.status || 500);
  }


  ErrorResponse.error = err
  return res.status(err.statusCode).json(ErrorResponse);
};

// Handle 404 errors (Not Found)
const notFound = (req, res, next) => {
  const err = new AppError('API Not Found',StatusCodes.NOT_FOUND);
  errorHandler(err, req, res);
};

module.exports = { errorHandler, notFound };
