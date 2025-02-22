const express = require("express");
const {
  getBidHistory,
  acceptBid,
} = require("../controllers/auctionController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:tokenId/bids", getBidHistory);
router.post("/:tokenId/accept", authenticate, acceptBid);

module.exports = router;
