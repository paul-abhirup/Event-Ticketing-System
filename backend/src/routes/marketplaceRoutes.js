const express = require("express");
const {
  listTicket,
  placeBid,
  purchaseTicket,
} = require("../controllers/marketplaceController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/list", authenticate, listTicket);
router.post("/bid", authenticate, placeBid);
router.post("/purchase/:listingId", authenticate, purchaseTicket);
module.exports = router;
