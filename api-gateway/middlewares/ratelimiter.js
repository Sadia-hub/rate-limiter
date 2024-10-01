const redis = require('redis');

// Create a Redis client
const client = redis.createClient({
  url: 'redis://localhost:6379', // Use correct Redis connection URL
});

// Connect to Redis
client.connect().then(() => {
    console.log('Connected to Redis');
  }).catch((err) => {
    console.error('Redis Connection Error:', err);
    process.exit(1); // Exit on connection error
  });

// Global Rate Limiting Middleware
const rateLimiter = async (req, res, next) => {
    const key = 'global_request_count'; // Single key for all requests
    const limit = 5; // Maximum allowed requests
    const expireTime = 60; // Expire the counter after 60 seconds
  
    try {
      // Increment the counter and get the new value
      const currentCount = await client.incr(key);
  
      // Set expiration only on the first request
      if (currentCount === 1) {
        await client.expire(key, expireTime); // Expire after 60 seconds
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