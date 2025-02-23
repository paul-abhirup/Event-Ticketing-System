const express = require("express");
const {
  listTicket,
  placeBid,
  purchaseTicket,
  getAllListings,
} = require("../controllers/marketplaceController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/listings", getAllListings);

// Protected routes
router.post("/list", authenticate, listTicket);
router.post("/bid", authenticate, placeBid);
router.post("/purchase/:id", authenticate, purchaseTicket);

module.exports = router;
