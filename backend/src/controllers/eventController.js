const { ticketNFT } = require("../services/blockchainService");
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

const validateTicket = async (req, res) => {
  const { qrHash, validatorSig } = req.body;
  try {
    // Verify the validator signature (pseudo-code)
    const isValidSignature = verifySignature(qrHash, validatorSig);
    if (!isValidSignature) throw new Error("Invalid validator signature");

    // Fetch ticket details from Supabase
    const { data: ticket, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("qr_hash", qrHash)
      .single();

    if (error) throw error;

    // Check if the ticket is valid on-chain
    const isUsed = await ticketNFT.isUsed(ticket.token_id);
    if (isUsed) throw new Error("Ticket has already been used");

    // Mark the ticket as used
    await supabase
      .from("tickets")
      .update({ is_used: true })
      .eq("token_id", ticket.token_id);

    res.status(200).json({ isValid: true, tokenDetails: ticket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUpcomingEvents, validateTicket };
