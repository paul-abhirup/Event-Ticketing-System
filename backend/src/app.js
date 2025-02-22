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

// Middleware
app.use(cors());
app.use(express.json());
app.use(limiter);

// Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/tickets", require("./routes/ticketRoutes"));
app.use("/marketplace", require("./routes/marketplaceRoutes"));
app.use("/events", require("./routes/eventRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/status", require("./routes/statusRoutes"));

module.exports = app;
