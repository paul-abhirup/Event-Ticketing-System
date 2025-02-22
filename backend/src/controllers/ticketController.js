const { ethers } = require("ethers");
const supabase = require("../services/supabaseService");
const { ticketNFT } = require("../services/blockchainService");

const mintTicket = async (req, res) => {
  const { eventId, recipientAddress } = req.body;
  try {
    // Mint ticket on-chain
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.BLOCKCHAIN_RPC_URL
    );
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const ticketNFT = new ethers.Contract(
      process.env.TICKET_NFT_ADDRESS,
      TicketNFT.abi,
      wallet
    );

    const tx = await ticketNFT.mint(recipientAddress);
    await tx.wait();

    // Store off-chain data in Supabase
    const { data: ticket, error } = await supabase.from("tickets").insert([
      {
        token_id: tx.hash,
        event_id: eventId,
        owner_address: recipientAddress,
      },
    ]);

    if (error) throw error;

    res
      .status(200)
      .json({ txHash: tx.hash, gasEstimate: tx.gasLimit.toString() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTicketDetails = async (req, res) => {
  const { tokenId } = req.params;
  try {
    // Fetch on-chain data
    const owner = await ticketNFT.ownerOf(tokenId);
    const isUsed = await ticketNFT.isUsed(tokenId);

    // Fetch off-chain data from Supabase
    const { data: ticket, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("token_id", tokenId)
      .single();

    if (error) throw error;

    res.status(200).json({
      owner,
      eventId: ticket.event_id,
      seatInfo: ticket.seat_info,
      isUsed,
      mintDate: ticket.mint_date,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// module.exports = { getTicketDetails };
module.exports = { mintTicket, getTicketDetails };
