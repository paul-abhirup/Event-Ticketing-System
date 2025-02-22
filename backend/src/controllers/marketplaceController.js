const { marketplace } = require("../services/blockchainService");
const supabase = require("../services/supabaseService");
const { pubClient } = require("../services/redisService");
const { getIO } = require("../services/socketService"); // Import getIO

const listTicket = async (req, res) => {
  const { tokenId, price, expiration } = req.body;
  try {
    // Validate input
    if (!tokenId || !price || !expiration) {
      return res
        .status(400)
        .json({ message: "Token ID, price, and expiration are required" });
    }

    // Check if the ticket is already listed
    const { data: existingListing, error: listingError } = await supabase
      .from("marketplace_listings")
      .select("*")
      .eq("token_id", tokenId);

    if (listingError) {
      console.error("Supabase Query Error:", listingError);
      return res
        .status(500)
        .json({ message: "Error checking existing listings" });
    }

    if (existingListing && existingListing.length > 0) {
      return res.status(400).json({ message: "Ticket is already listed" });
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

    // Check if the user has already placed a bid for this ticket
    const { data: existingBid, error: bidError } = await supabase
      .from("bids")
      .select("*")
      .eq("token_id", tokenId)
      .eq("bidder_address", req.user.walletAddress)
      .single();

    if (bidError && bidError.code !== "PGRST116") {
      // PGRST116 means no rows returned
      console.error("Supabase Query Error:", bidError);
      return res.status(500).json({ message: "Error checking existing bids" });
    }

    // If bid exists, validate new amount is higher
    if (existingBid) {
      if (bidAmount <= existingBid.amount) {
        return res.status(400).json({
          message: "New bid amount must be higher than your current bid",
          currentBid: existingBid.amount,
        });
      }

      // Update existing bid - only modify amount
      const { data: updatedBid, error: updateError } = await supabase
        .from("bids")
        .update({ amount: bidAmount }) // Remove updated_at
        .eq("token_id", tokenId)
        .eq("bidder_address", req.user.walletAddress)
        .select()
        .single();

      if (updateError) {
        console.error("Supabase Update Error:", updateError);
        return res.status(500).json({ message: "Error updating bid" });
      }

      // Create bid update object for notification
      const bidUpdate = {
        tokenId,
        bidder: req.user.walletAddress,
        amount: bidAmount,
        timestamp: new Date().toISOString(),
        type: "update",
      };

      // Emit and publish updates
      const io = getIO();
      if (io) {
        io.to(`ticket:${tokenId}`).emit("newBid", bidUpdate);
      }
      await pubClient.publish(`ticket:${tokenId}`, JSON.stringify(bidUpdate));

      return res.status(200).json({
        message: "Bid updated successfully",
        bid: bidUpdate,
      });
    }

    // Place new bid
    const { data: newBid, error } = await supabase
      .from("bids")
      .insert([
        {
          token_id: tokenId,
          bidder_address: req.user.walletAddress,
          amount: bidAmount,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase Insert Error:", error);
      return res.status(500).json({ message: "Error placing bid" });
    }

    // Create bid update object for new bid
    const bidUpdate = {
      tokenId,
      bidder: req.user.walletAddress,
      amount: bidAmount,
      timestamp: new Date().toISOString(),
      type: "new",
    };

    // Emit and publish updates
    const io = getIO();
    if (io) {
      io.to(`ticket:${tokenId}`).emit("newBid", bidUpdate);
    }
    await pubClient.publish(`ticket:${tokenId}`, JSON.stringify(bidUpdate));

    res.status(200).json({
      message: "Bid placed successfully",
      bid: bidUpdate,
    });
  } catch (error) {
    console.error("Bid Error:", error);
    res.status(500).json({
      message: error.message || "Error processing bid",
    });
  }
};

const purchaseTicket = async (req, res) => {
  const { id } = req.params;
  try {
    // Fetch listing details from Supabase
    const { data: listing, error } = await supabase
      .from("marketplace_listings")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Supabase Query Error:", error);
      return res
        .status(500)
        .json({ message: "Error fetching listing details" });
    }

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Execute purchase on-chain
    const tx = await marketplace.buyTicket(listing.token_id, {
      // Use buyTicket instead of purchaseTicket
      value: listing.price,
    });
    await tx.wait();

    // Update ticket ownership in Supabase
    const { error: updateError } = await supabase
      .from("tickets")
      .update({ owner_address: req.user.walletAddress })
      .eq("token_id", listing.token_id);

    if (updateError) {
      console.error("Supabase Update Error:", updateError);
      return res
        .status(500)
        .json({ message: "Error updating ticket ownership" });
    }

    // Mark the listing as sold (optional)
    const { error: deleteError } = await supabase
      .from("marketplace_listings")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Supabase Delete Error:", deleteError);
      return res.status(500).json({ message: "Error marking listing as sold" });
    }

    res.status(200).json({ purchaseTx: tx.hash });
  } catch (error) {
    console.error("Purchase Error:", error);
    res
      .status(500)
      .json({ message: error.message || "Error purchasing ticket" });
  }
};

module.exports = { listTicket, placeBid, purchaseTicket };
