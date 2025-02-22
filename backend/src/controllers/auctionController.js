const { marketplace } = require("../services/blockchainService");
const supabase = require("../services/supabaseService");
const { pubClient } = require("../services/redisService");
const io = require("../services/socketService");

const getBidHistory = async (req, res) => {
  const { tokenId } = req.params;
  const cacheKey = `bids:${tokenId}`; // Unique cache key for the ticket

  try {
    // Check Redis cache
    const cachedBids = await pubClient.get(cacheKey);
    if (cachedBids) {
      return res.status(200).json(JSON.parse(cachedBids));
    }

    // Fetch from Supabase if not in cache
    const { data: bids, error } = await supabase
      .from("bids")
      .select("*")
      .eq("token_id", tokenId)
      .order("amount", { ascending: false });

    if (error) throw error;

    // Cache the data for 5 minutes (300 seconds)
    await pubClient.setEx(cacheKey, 300, JSON.stringify(bids));

    res.status(200).json(bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const acceptBid = async (req, res) => {
  const { tokenId } = req.params;
  try {
    // Fetch the highest bid from Supabase
    const { data: highestBid, error } = await supabase
      .from("bids")
      .select("*")
      .eq("token_id", tokenId)
      .order("amount", { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;

    // Accept the bid on-chain
    const tx = await marketplace.acceptBid(
      tokenId,
      highestBid.bidder_address,
      highestBid.amount
    );
    await tx.wait();

    // Update ticket ownership in Supabase
    await supabase
      .from("tickets")
      .update({ owner_address: highestBid.bidder_address })
      .eq("token_id", tokenId);

    res.status(200).json({ transferTx: tx.hash });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const placeBid = async (req, res) => {
  if (!req.user?.walletAddress) {
    return res.status(401).json({ message: "Authentication required" });
  }
  const { tokenId, bidAmount } = req.body;
  try {
    // Input validation
    if (!tokenId || !bidAmount) {
      return res.status(400).json({
        message: "Token ID and bid amount are required",
      });
    }

    // Place bid in Supabase
    const { data: bid, error } = await supabase.from("bids").insert([
      {
        token_id: tokenId,
        bidder_address: req.user.walletAddress,
        amount: bidAmount,
      },
    ]);

    if (error) throw error;

    // Create bid update object
    const bidUpdate = {
      tokenId,
      bidder: req.user.walletAddress,
      amount: bidAmount,
      timestamp: new Date().toISOString(),
    };

    // Emit bid update via WebSocket
    io.to(`ticket:${tokenId}`).emit("newBid", bidUpdate);

    // Publish to Redis
    await pubClient.publish(`ticket:${tokenId}`, JSON.stringify(bidUpdate));

    res.status(200).json({
      bidId: bid.id,
      bid: bidUpdate,
    });
  } catch (error) {
    console.error("Bid Error:", error);
    res.status(500).json({
      message: error.message || "Error placing bid",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

const getAuctionDetails = async (req, res) => {
  const { tokenId } = req.params;
  try {
    // Get auction details from Supabase
    const { data: auction, error: auctionError } = await supabase
      .from("auctions")
      .select(
        `
        *,
        bids (
          amount,
          bidder_address,
          created_at
        )
      `
      )
      .eq("token_id", tokenId)
      .single();

    if (auctionError) throw auctionError;

    // Get current highest bid from smart contract
    const highestBid = await marketplace.highestBids(tokenId);

    res.status(200).json({
      auction,
      currentHighestBid: {
        amount: highestBid.amount.toString(),
        bidder: highestBid.bidder,
      },
    });
  } catch (error) {
    console.error("Auction Details Error:", error);
    res.status(500).json({
      message: error.message || "Error fetching auction details",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

module.exports = {
  getBidHistory,
  acceptBid,
  placeBid,
  getAuctionDetails,
};
