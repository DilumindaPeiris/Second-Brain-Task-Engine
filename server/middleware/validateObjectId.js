const mongoose = require('mongoose');
const AppError = require('../utils/AppError');

/**
 * Middleware to validate that a route param is a valid MongoDB ObjectId.
 *
 * Usage:
 *   router.put('/:id', validateObjectId('id'), updateHandler);
 *
 * @param {string} paramName - The route parameter name to validate
 * @returns {Function} Express middleware
 */
const validateObjectId = (paramName = 'id') => (req, _res, next) => {
  const value = req.params[paramName];

  if (!mongoose.Types.ObjectId.isValid(value)) {
    return next(new AppError(`Invalid ${paramName}: "${value}" is not a valid ID`, 400));
  }

  next();
};

module.exports = validateObjectId;
