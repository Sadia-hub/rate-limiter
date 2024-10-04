const redisClient = require("../config/redisClient")


// Global Rate Limiting Middleware
const rateLimiter = async (req, res, next) => {
  const key = 'global_request_count'; // Single key for all requests
  const limit = 5; // Maximum allowed requests
  const expireTime = 60; // Expire the counter after 60 seconds

  try {
    // Increment the counter and get the new value
    const currentCount = await redisClient.incr(key);

    // Set expiration only on the first request
    if (currentCount === 1) {
      await redisClient.expire(key, expireTime); // Expire after 60 seconds
    }

    // Check if the request count exceeds the limit
    if (currentCount > limit) {
      return res.status(429).json({ message: 'Too many requests, please try again later.' });
    }

    // Allow request to proceed
    next();
  } catch (err) {
    console.error('Rate Limiter Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = rateLimiter