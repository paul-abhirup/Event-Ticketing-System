const supabase = require("../services/supabaseService");

const getUserTickets = async (req, res) => {
  const { address } = req.params;
  try {
    const { data: tickets, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("owner_address", address);

    if (error) throw error;

    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserActivity = async (req, res) => {
  const { address } = req.params;
  try {
    const { data: activity, error } = await supabase
      .from("activity")
      .select("*")
      .eq("user_address", address);

    if (error) throw error;

    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserTickets, getUserActivity };
