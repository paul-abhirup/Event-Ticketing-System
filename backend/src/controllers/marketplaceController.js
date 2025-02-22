const { marketplace } = require("../services/blockchainService");
const supabase = require("../services/supabaseService");
const { pubClient } = require("../services/redisService");
const { io } = require("../services/socketService");

const listTicket = async (req, res) => {
  const { tokenId, price, expiration } = req.body;
  try {
    // Validate input
    if (!tokenId || !price || !expiration) {
      return res
        .status(400)
        .json({ message: "Token ID, price, and expiration are required" });
    }

    // Create listing in Supabase
    const { data: listing, error } = await supabase
      .from("marketplace_listings")
      .insert([
        {
          token_id: tokenId,
          price,
          seller_address: req.user.walletAddress,
          expiration,
        },
      ])
      .select() // Add this to return the inserted data
      .single(); // Add this to return a single object

    if (error) {
      console.error("Supabase Insert Error:", error);
      return res
        .status(500)
        .json({ message: "Error creating listing", error: error.message });
    }

    if (!listing) {
      return res
        .status(500)
        .json({ message: "Listing creation failed: No data returned" });
    }

    res.status(200).json({ listingId: listing.id, txPayload: "0x..." });
  } catch (error) {
    console.error("List Ticket Error:", error);
    res.status(500).json({ message: error.message || "Error listing ticket" });
  }
};

const placeBid = async (req, res) => {
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

    // Emit bid update via WebSocket to all clients in the ticket's room
    io.to(`ticket:${tokenId}`).emit("newBid", bidUpdate);

    // Also publish to Redis for other server instances
    await pubClient.publish(`ticket:${tokenId}`, JSON.stringify(bidUpdate));

    res.status(200).json({
      bidNonce: bid.id,
      txData: "0x...",
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

const purchaseTicket = async (req, res) => {
  const { listingId } = req.params;
  try {
    // Fetch listing details from Supabase
    const { data: listing, error } = await supabase
      .from("marketplace_listings")
      .select("*")
      .eq("id", listingId)
      .single();

    if (error) throw error;

    // Execute purchase on-chain
    const tx = await marketplace.purchaseTicket(listing.token_id, {
      value: listing.price,
    });
    await tx.wait();

    // Update ticket ownership in Supabase
    await supabase
      .from("tickets")
      .update({ owner_address: req.user.walletAddress })
      .eq("token_id", listing.token_id);

    res.status(200).json({ purchaseTx: tx.hash });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { listTicket, placeBid, purchaseTicket };
