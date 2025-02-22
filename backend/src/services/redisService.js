const Redis = require("redis");

// Redis connection configuration for Aiven
const redisConfig = {
  url: process.env.REDIS_URL, // Aiven Redis URL with credentials
  socket: {
    tls: true, // Enable TLS for Aiven
    rejectUnauthorized: true, // Verify SSL certificate
  },
  retry_strategy: function (options) {
    if (options.error && options.error.code === "ECONNREFUSED") {
      // End reconnecting on a specific error
      console.error(
        "Redis connection refused. Check Aiven credentials and URL"
      );
    }
    // Reconnect after 3 seconds
    return Math.min(options.attempt * 1000, 3000);
  },
};

// Create Redis clients
const pubClient = Redis.createClient(redisConfig);
const subClient = Redis.createClient(redisConfig);

// Handle connection events
pubClient.on("error", (err) => console.error("Redis Pub error:", err));
pubClient.on("connect", () => console.log("Redis Pub Client Connected"));

subClient.on("error", (err) => console.error("Redis Sub error:", err));
subClient.on("connect", () => console.log("Redis Sub Client Connected"));

// Connect to Redis
(async () => {
  try {
    await pubClient.connect();
    await subClient.connect();
  } catch (err) {
    console.error("Redis Connection Error:", err);
  }
})();

module.exports = { pubClient, subClient };
