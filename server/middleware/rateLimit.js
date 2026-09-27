/**
 * Simple in-memory rate limiter middleware.
 *
 * Tracks request counts per IP within a sliding window.
 * Returns 429 Too Many Requests when the limit is exceeded.
 *
 * @param {Object} options
 * @param {number} options.windowMs - Time window in milliseconds (default: 15 min)
 * @param {number} options.max - Max requests per window per IP (default: 100)
 */
const rateLimit = ({ windowMs = 15 * 60 * 1000, max = 100 } = {}) => {
  const hits = new Map();

  // Cleanup expired entries periodically
  const cleanup = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of hits) {
      if (now - record.start > windowMs) {
        hits.delete(key);
      }
    }
  }, windowMs);

  // Allow garbage collection of the interval
  if (cleanup.unref) cleanup.unref();

  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const record = hits.get(key);

    if (!record || now - record.start > windowMs) {
      hits.set(key, { count: 1, start: now });
      return next();
    }

    record.count += 1;

    if (record.count > max) {
      res.set('Retry-After', Math.ceil((record.start + windowMs - now) / 1000));
      return res.status(429).json({
        message: 'Too many requests. Please try again later.',
      });
    }

    next();
  };
};

module.exports = rateLimit;
