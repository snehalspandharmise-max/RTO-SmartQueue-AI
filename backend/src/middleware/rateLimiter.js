/**
 * Simple in-memory rate limiting middleware
 */
const requests = new Map();

export function rateLimiter({ windowMs = 60000, max = 120, message = 'Too many requests, please try again later.' } = {}) {
  return (req, res, next) => {
    // Skip in test environment
    if (process.env.NODE_ENV === 'test') {
      return next();
    }

    const ip = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    const now = Date.now();
    const timestamps = (requests.get(ip) || []).filter(ts => now - ts < windowMs);

    if (timestamps.length >= max) {
      return res.status(429).json({
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message
        }
      });
    }

    timestamps.push(now);
    requests.set(ip, timestamps);
    next();
  };
}
