const { ticketNFT } = require("../services/blockchainService");
const supabase = require("../services/supabaseService");
const verifySignature = require("../utils/verifySignature"); // Import the function

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

const validateTicket = async (req, res) => {
  const { tokenId } = req.body;
  try {
    // Validate input
    if (!tokenId) {
      return res.status(400).json({ message: "Token ID is required" });
    }

    // Fetch ticket details from the blockchain
    const owner = await ticketNFT.ownerOf(tokenId);
    const isUsed = await ticketNFT.isUsed(tokenId);

    if (!owner) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (isUsed) {
      return res.status(400).json({ message: "Ticket has already been used" });
    }

    // Fetch event details from Supabase
    const { data: ticket, error: ticketError } = await supabase
      .from("tickets")
      .select("*")
      .eq("token_id", tokenId)
      .single();

    if (ticketError) {
      console.error("Supabase Query Error:", ticketError);
      return res.status(500).json({ message: "Error fetching ticket details" });
    }

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found in database" });
    }

    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("*")
      .eq("id", ticket.event_id)
      .single();

    if (eventError) {
      console.error("Supabase Query Error:", eventError);
      return res.status(500).json({ message: "Error fetching event details" });
    }

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({
      tokenId,
      isValid: true,
      eventName: event.name,
    });
  } catch (error) {
    console.error("Validation Error:", error);
    res
      .status(500)
      .json({ message: error.message || "Error validating ticket" });
  }
};

module.exports = { getUpcomingEvents, validateTicket };
