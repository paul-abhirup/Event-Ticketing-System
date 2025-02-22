const express = require("express");
const {
  getUpcomingEvents,
  validateTicket,
} = require("../controllers/eventController");

const router = express.Router();

router.get("/upcoming", getUpcomingEvents);
router.post("/validate", validateTicket);

module.exports = router;
