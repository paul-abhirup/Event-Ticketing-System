const express = require("express");
const {
  getBidHistory,
  acceptBid,
  placeBid,
  getAuctionDetails,
} = require("../controllers/auctionController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:tokenId/bids", getBidHistory);
router.post("/:tokenId/accept", authenticate, acceptBid);
router.post("/bid", placeBid);
router.get("/:tokenId", getAuctionDetails);

module.exports = router;
