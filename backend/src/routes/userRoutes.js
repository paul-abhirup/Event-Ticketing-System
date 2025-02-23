const express = require("express");
const {
  getUserTickets,
  getUserActivity,
} = require("../controllers/userController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

// Add logging middleware
router.use('/:address/tickets', (req, res, next) => {
  console.log('Accessing tickets route:', {
    address: req.params.address,
    method: req.method,
    headers: req.headers
  });
  next();
});

// Protected routes
router.get("/:address/tickets", authenticate, getUserTickets);
// router.get("/:address/activity", authenticate, getUserActivity);

module.exports = router;
