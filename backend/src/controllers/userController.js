const supabase = require("../services/supabaseService");

const getUserTickets = async (req, res) => {
  const { address } = req.params;
  
  console.log('Fetching tickets for address:', address);
  
  try {
    // First, let's check if any tickets exist for this address using ilike for case-insensitive comparison
    const { data: tickets, error } = await supabase
      .from("tickets")
      .select(`
        token_id,
        event_id,
        owner_address,
        mint_date,
        is_used,
        events (
          name,
          date,
          ipfs_cid,
          venue
        )
      `)
      .ilike("owner_address", address); // Changed from eq to ilike for case-insensitive match

    console.log('Full Supabase response:', { 
      tickets, 
      error,
      queryAddress: address,
      ticketCount: tickets?.length || 0
    });

    if (error) {
      console.error("Error fetching tickets:", error);
      return res.status(500).json({ 
        message: "Error fetching tickets",
        error: error.message 
      });
    }

    if (!tickets || tickets.length === 0) {
      console.log('No tickets found for address:', address);
      // Let's check what's in the tickets table
      const { data: allTickets } = await supabase
        .from("tickets")
        .select('owner_address')
        .limit(5);
      console.log('Sample of tickets in database:', allTickets);
      
      return res.status(200).json([]);
    }

    // Format the response
    const formattedTickets = tickets.map(ticket => ({
      token_id: ticket.token_id,
      event_id: ticket.event_id,
      owner_address: ticket.owner_address,
      event_name: ticket.events?.name || 'Unknown Event',
      event_date: ticket.events?.date || null,
      ipfs_cid: ticket.events?.ipfs_cid || '',
      venue: ticket.events?.venue || '',
      mint_date: ticket.mint_date,
      is_used: ticket.is_used
    }));

    console.log('Sending formatted tickets:', formattedTickets);
    res.status(200).json(formattedTickets);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
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
