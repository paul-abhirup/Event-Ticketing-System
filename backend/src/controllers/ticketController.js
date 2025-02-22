const { ethers } = require("ethers");
const supabase = require("../services/supabaseService");
const TicketNFT = require("../TicketNFT.json");
const { eventNames } = require("../app");

// Add this at the top to debug
console.log("Contract ABI:", TicketNFT.abi);

const mintTicket = async (req, res) => {
  try {
    // Log the entire request for debugging
    console.log("Mint request details:", {
      body: req.body,
      headers: req.headers,
      user: req.user,
    });

    // Extract data from request body
    const { quantity, recipientAddress, event_id } = req.body;
    const walletAddress = req.user?.walletAddress;

    // Validate event_id
    if (!event_id) {
      return res.status(400).json({
        message: "Event ID is required",
        debug: { receivedBody: req.body },
      });
    }

    // Verify event exists in Supabase
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("*")
      .eq("id", event_id)
      .single();

    if (eventError || !event) {
      return res.status(400).json({
        message: "Invalid event ID or event not found",
        debug: { event_id },
      });
    }

    // Validate wallet address
    if (!walletAddress) {
      return res.status(401).json({
        message: "Wallet address not found in token",
        debug: { user: req.user },
      });
    }

    // Validate quantity
    if (!quantity) {
      return res.status(400).json({
        message: "Quantity is required",
        debug: {
          receivedBody: req.body,
          bodyType: typeof req.body,
        },
      });
    }

    // Parse and validate quantity
    const numQuantity = parseInt(quantity);
    if (isNaN(numQuantity) || numQuantity < 1) {
      return res.status(400).json({
        message: "Quantity must be a positive number",
        debug: {
          receivedQuantity: quantity,
          parsedQuantity: numQuantity,
          type: typeof quantity,
        },
      });
    }

    // Validate recipient address
    if (!recipientAddress) {
      return res.status(400).json({
        message: "Recipient address is required",
      });
    }

    console.log("Processing mint request:", {
      quantity: numQuantity,
      walletAddress,
      recipientAddress,
    });

    // Initialize contract
    const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const contract = new ethers.Contract(
      process.env.TICKET_NFT_ADDRESS,
      TicketNFT.abi,
      wallet
    );

    // Log available functions for debugging
    console.log("Available functions:", contract.interface.fragments);

    // Mint tickets in a loop (since the contract only supports minting one at a time)
    const txHashes = [];
    const tokenIds = [];

    for (let i = 0; i < numQuantity; i++) {
      try {
        // Mint a single token to the recipient address
        const tx = await contract.mint(recipientAddress, { gasLimit: 300000 }); // Adjust gas limit if needed
        const receipt = await tx.wait();

        // Get token ID from event logs
        const mintEvent = receipt.logs.find(
          (log) =>
            log.eventName === "Transfer" && log.args.from === ethers.ZeroAddress
        );
        const tokenId = mintEvent.args.tokenId;

        // Store in Supabase
        const { error } = await supabase.from("tickets").insert({
          token_id: tokenId.toString(),
          owner_address: recipientAddress,
          event_id: event_id,
          mint_date: new Date().toISOString(),
        });

        if (error) throw error;

        // Save transaction hash and token ID
        txHashes.push(tx.hash);
        tokenIds.push(tokenId.toString());
      } catch (err) {
        console.error(`Mint failed for iteration ${i}:`, err);
        // Continue minting even if one iteration fails
      }
    }

    // Check if any tokens were minted successfully
    if (txHashes.length === 0) {
      throw new Error("No tokens were minted");
    }

    res.status(200).json({
      message: "Tickets minted successfully",
      data: {
        txHashes,
        tokenIds,
        event: {
          id: event.id,
          name: event.name,
          date: event.date,
        },
        recipient: recipientAddress,
        quantity: txHashes.length,
      },
    });
  } catch (error) {
    console.error("Mint Error:", error);
    res.status(500).json({
      message: error.message || "Error minting tickets",
    });
  }
};

const getTicketDetails = async (req, res) => {
  const { tokenId } = req.params;
  try {
    console.log("Fetching details for tokenId:", tokenId);

    // Initialize contract for reading
    const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
    const contract = new ethers.Contract(
      process.env.TICKET_NFT_ADDRESS,
      TicketNFT.abi,
      provider
    );

    // Check if the token exists
    let owner;
    try {
      owner = await contract.ownerOf(tokenId);
    } catch (error) {
      if (error.message.includes("ERC721NonexistentToken")) {
        return res.status(404).json({ message: "Token does not exist" });
      }
      throw error;
    }

    console.log("Owner:", owner);

    // Fetch isUsed status
    const isUsed = await contract.isUsed(tokenId);
    console.log("Is Used:", isUsed);

    // Fetch off-chain data from Supabase
    console.log("Fetching off-chain data for tokenId:", tokenId);
    const { data: ticket, error } = await supabase
      .from("tickets")
      .select("*", "event_name")
      .eq("token_id", tokenId)
      .single();

    if (error) throw error;

    res.status(200).json({
      owner,
      eventId: ticket.event_id,
      eventNames: ticket.event_name,
      seatInfo: ticket.seat_info,
      isUsed,
      mintDate: ticket.mint_date,
    });
    // console.log(res);
  } catch (error) {
    console.error("Error in getTicketDetails:", error);
    res.status(500).json({ message: error.message });
  }
};

// module.exports = { getTicketDetails };
module.exports = { mintTicket, getTicketDetails };
