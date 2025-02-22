const supabase = require("../services/supabaseService");

const getUpcomingEvents = async (req, res) => {
  try {
    const { data: events, error } = await supabase
      .from("events")
      .select("*")
      .gt("date", new Date().toISOString());

    if (error) throw error;

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUpcomingEvents };
