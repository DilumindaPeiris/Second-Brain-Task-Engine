const jwt = require('jsonwebtoken');

/**
 * JWT authentication middleware.
 *
 * Expects the token in the Authorization header:
 *   Authorization: Bearer <token>
 *
 * On success, attaches `req.userId` for downstream handlers.
 * On failure, responds with 401.
 */
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized — no token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized — token invalid or expired' });
  }
};

module.exports = protect;
