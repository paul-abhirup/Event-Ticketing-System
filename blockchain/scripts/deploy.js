require("@nomicfoundation/hardhat-verify");
const hre = require("hardhat");

require("dotenv").config();

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy TicketNFT
  const TicketNFT = await hre.ethers.getContractFactory("TicketNFT");
  const ticketNFT = await TicketNFT.deploy(
    "EventTicket", // Token name
    "TKT", // Token symbol
    "https://example.com/", // Base URI
    7, // Maximum tickets per wallet
    deployer.address // Initial owner address
  );
  await ticketNFT.waitForDeployment();
  console.log("TicketNFT deployed to:", ticketNFT.target);

  // Deploy Marketplace
  const Marketplace = await hre.ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(
    ticketNFT.target, // Address of the deployed TicketNFT contract
    hre.ethers.parseEther("1.0"), // Maximum resale price (1 ETH)
    10 // Royalty percentage (10%)
  );
  await marketplace.waitForDeployment();
  console.log("Marketplace deployed to:", marketplace.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
