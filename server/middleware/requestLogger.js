/**
 * Request logger middleware.
 *
 * Logs method, URL, status code, and response time for every request.
 * Color-coded by status code family for quick visual scanning.
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Capture the original end function
  const originalEnd = res.end;
  res.end = function (...args) {
    const duration = Date.now() - start;
    const status = res.statusCode;

    // Color code by status family
    let color;
    if (status >= 500) color = '\x1b[31m';      // Red
    else if (status >= 400) color = '\x1b[33m';  // Yellow
    else if (status >= 300) color = '\x1b[36m';  // Cyan
    else color = '\x1b[32m';                     // Green
    const reset = '\x1b[0m';

    console.log(
      `${color}${req.method}${reset} ${req.originalUrl} ${color}${status}${reset} - ${duration}ms`
    );

    originalEnd.apply(res, args);
  };

  next();
};

module.exports = requestLogger;
