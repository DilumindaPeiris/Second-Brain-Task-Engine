/**
 * Security headers middleware.
 *
 * Sets common HTTP security headers to protect against
 * XSS, clickjacking, MIME sniffing, and other attacks.
 */
const securityHeaders = (_req, res, next) => {
  // Prevent XSS by controlling resource loading
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // Enable XSS filter in browsers that support it
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Control referrer information
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Restrict permissions/features
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()'
  );

  // Prevent MIME type sniffing
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  next();
};

module.exports = securityHeaders;
