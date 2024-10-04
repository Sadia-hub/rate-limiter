const redis = require('redis');

// Create and export a Redis client
const createRedisClient = () => {
  const client = redis.createClient({
    url: 'redis://localhost:6379',
  });

  // Handle connection events
  client.connect().then(() => {
    console.log('Connected to Redis');
  }).catch((err) => {
    console.error('Redis Connection Error:', err);
    process.exit(1); // Exit on connection error
  });

  return client;
};

module.exports = createRedisClient();
