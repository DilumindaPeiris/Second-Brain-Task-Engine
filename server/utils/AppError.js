/**
 * Custom application error class.
 * Extends the native Error with an HTTP status code for clean error handling.
 */
class AppError extends Error {
  /**
   * @param {string} message - Human-readable error message
   * @param {number} statusCode - HTTP status code (default 500)
   */
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Distinguish from programmer errors

    // Capture stack trace, excluding this constructor
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
