const { marketplace } = require("../services/blockchainService");
const supabase = require("../services/supabaseService");
const redisClient = require("../services/redisService");

const getBidHistory = async (req, res) => {
  const { tokenId } = req.params;
  const cacheKey = `bids:${tokenId}`; // Unique cache key for the ticket

  try {
    // Check Redis cache
    const cachedBids = await redisClient.get(cacheKey);
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
    await redisClient.setEx(cacheKey, 300, JSON.stringify(bids));

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

module.exports = { getBidHistory, acceptBid };
