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

const authRoutes = require("./routes/authRoutes");
const marketplaceRoutes = require('./routes/marketplaceRoutes');
const userRoutes = require("./routes/userRoutes");

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);
app.use(morgan("combined")); // Logs all requests
app.use(helmet());

// Apply to authentication routes
// app.use("/api/auth", authLimiter);

// Routes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/auth", authRoutes);
app.use("/tickets", require("./routes/ticketRoutes"));
app.use("/api/marketplace", marketplaceRoutes);
app.use("/events", require("./routes/eventRoutes"));
app.use("/api/users", userRoutes);
app.use("/status", require("./routes/statusRoutes"));
app.use("/auction", require("./routes/auctionRoutes"));

// Error handlers
app.use((err, req, res, next) => {
  console.error("Error:", err);
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      message: "Invalid JSON payload",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
  next(err);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

// 404 handler
app.use((req, res) => {
  console.log("404 Not Found:", req.method, req.url);
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
