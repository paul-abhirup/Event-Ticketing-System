const express = require("express");
const { getUpcomingEvents } = require("../controllers/eventController");

const router = express.Router();

router.get("/upcoming", getUpcomingEvents);

module.exports = router;
