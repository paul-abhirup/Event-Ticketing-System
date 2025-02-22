const supabase = require("../services/supabaseService");

const getRoyalties = async (req, res) => {
  const { organizer } = req.params;
  try {
    // Fetch royalties from Supabase
    const { data: royalties, error } = await supabase
      .from("royalties")
      .select("*")
      .eq("organizer_address", organizer);

    if (error) throw error;

    // Calculate total and pending royalties
    const totalEarned = royalties.reduce(
      (sum, royalty) => sum + parseFloat(royalty.amount),
      0
    );
    const pendingPayout = royalties
      .filter((royalty) => !royalty.paid)
      .reduce((sum, royalty) => sum + parseFloat(royalty.amount), 0);

    res.status(200).json({
      totalEarned,
      pendingPayout,
      payoutAddress: organizer,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRoyalties };
