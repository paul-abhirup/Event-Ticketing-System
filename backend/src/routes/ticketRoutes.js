const express = require("express");
const {
  mintTicket,
  getTicketDetails,
} = require("../controllers/ticketController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/mint", authenticate, mintTicket);
router.get("/:tokenId", authenticate, getTicketDetails);

module.exports = router;
