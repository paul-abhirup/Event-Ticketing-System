const supabase = require("../services/supabaseService");

const getBidHistory = async (req, res) => {
  const { tokenId } = req.params;
  try {
    const { data: bids, error } = await supabase
      .from("bids")
      .select("*")
      .eq("token_id", tokenId)
      .order("amount", { ascending: false });

    if (error) throw error;

    res.status(200).json(bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBidHistory };
