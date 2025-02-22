const redis = require("redis");

// Create Redis clients
const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

const pubClient = redisClient.duplicate(); // For publishing messages
const subClient = redisClient.duplicate(); // For subscribing to messages

// Handle Redis connection errors
redisClient.on("error", (err) => console.error("Redis error:", err));
pubClient.on("error", (err) => console.error("Redis Pub error:", err));
subClient.on("error", (err) => console.error("Redis Sub error:", err));

// Connect to Redis
Promise.all([redisClient.connect(), pubClient.connect(), subClient.connect()]);

module.exports = { redisClient, pubClient, subClient };
