const express = require("express");
const {
  mintTicket,
  getTicketDetails,
} = require("../controllers/ticketController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

// Add logging middleware
router.use((req, res, next) => {
  console.log("Ticket route accessed:", {
    method: req.method,
    path: req.path,
    body: req.body,
  });
  next();
});

router.post("/mint", authenticate, mintTicket);
router.get("/:tokenId", authenticate, getTicketDetails);

module.exports = router;
