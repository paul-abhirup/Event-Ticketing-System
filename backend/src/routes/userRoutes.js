const express = require("express");
const {
  getUserTickets,
  getUserActivity,
} = require("../controllers/userController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

// Protected routes
router.get("/:address/tickets", authenticate, getUserTickets);
router.get("/:address/activity", authenticate, getUserActivity);

module.exports = router;
