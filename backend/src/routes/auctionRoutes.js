const express = require("express");
const {
  getBidHistory,
  acceptBid,
  // placeBid,
  getAuctionDetails,
} = require("../controllers/auctionController");
const { placeBid } = require("../controllers/marketplaceController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:tokenId/bids", getBidHistory);
router.post("/:tokenId/accept", authenticate, acceptBid);
router.post("/bid", authenticate, placeBid);
router.get("/:tokenId", getAuctionDetails);

module.exports = router;
