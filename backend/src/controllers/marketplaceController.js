const { marketplace } = require("../services/blockchainService");
const supabase = require("../services/supabaseService");

const listTicket = async (req, res) => {
  const { tokenId, price, expiration } = req.body;
  try {
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
      ]);

    if (error) throw error;

    res.status(200).json({ listingId: listing.id, txPayload: "0x..." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const placeBid = async (req, res) => {
  const { tokenId, bidAmount } = req.body;
  try {
    // Place bid in Supabase
    const { data: bid, error } = await supabase.from("bids").insert([
      {
        token_id: tokenId,
        bidder_address: req.user.walletAddress,
        amount: bidAmount,
      },
    ]);

    if (error) throw error;

    res.status(200).json({ bidNonce: bid.id, txData: "0x..." });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
