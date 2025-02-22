const { ethers } = require("ethers");

// Initialize provider and wallet
const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Load smart contract ABIs (replace with your actual ABI)
const TicketNFT = require("../TicketNFT.json");
const Marketplace = require("../Marketplace.json");

// Initialize contract instances
const ticketNFT = new ethers.Contract(
  process.env.TICKET_NFT_ADDRESS,
  TicketNFT.abi,
  wallet
);
const marketplace = new ethers.Contract(
  process.env.MARKETPLACE_ADDRESS,
  Marketplace.abi,
  wallet
);

module.exports = { ticketNFT, marketplace };
