const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
});

//logging requests
const morgan = require("morgan");

const helmet = require("helmet");

// Middleware
app.use(cors());
app.use(express.json());
app.use(limiter);
app.use(morgan("combined")); // Logs all requests
app.use(helmet());

// Apply to authentication routes
app.use("/api/auth", authLimiter);

//error handling globally
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/tickets", require("./routes/ticketRoutes"));
app.use("/marketplace", require("./routes/marketplaceRoutes"));
app.use("/events", require("./routes/eventRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/status", require("./routes/statusRoutes"));

module.exports = app;
