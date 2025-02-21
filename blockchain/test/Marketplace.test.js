const { expect } = require("chai");
const { ethers } = require("hardhat");
const { ZeroAddress } = ethers;

describe("Marketplace", function () {
  let TicketNFT, ticketNFT, Marketplace, marketplace, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    TicketNFT = await ethers.getContractFactory("TicketNFT");
    Marketplace = await ethers.getContractFactory("Marketplace");

    ticketNFT = await TicketNFT.deploy(
      "EventTicket", // Token name
      "TKT", // Token symbol
      "https://example.com/", // Base URI
      5, // Maximum tickets per wallet
      owner.address // Initial owner address
    );
    await ticketNFT.waitForDeployment();

    // Correctly retrieve the deployed contract address
    const ticketNFTAddress = await ticketNFT.getAddress();

    marketplace = await Marketplace.deploy(
      ticketNFTAddress, // Use the retrieved address
      ethers.parseEther("1.0"), // Maximum resale price (1 ETH)
      10 // Royalty percentage (10%)
    );
    await marketplace.waitForDeployment(); // Ensure deployment is complete

    // Get marketplace address for approval
    const marketplaceAddress = await marketplace.getAddress();

    // Set approval for marketplace to handle NFTs
    await ticketNFT.connect(addr1).setApprovalForAll(marketplaceAddress, true);
  });

  it("should allow seller to list a ticket", async function () {
    await ticketNFT.mint(addr1.address);
    const marketplaceAddress = await marketplace.getAddress();
    await ticketNFT.connect(addr1).approve(marketplaceAddress, 0);
    await marketplace.connect(addr1).listTicket(0, ethers.parseEther("0.5"));

    const listing = await marketplace.listings(0);
    expect(listing.price).to.equal(ethers.parseEther("0.5"));
    expect(listing.seller).to.equal(addr1.address);
  });

  it("should not allow listing above max resale price", async function () {
    await ticketNFT.mint(addr1.address);
    const marketplaceAddress = await marketplace.getAddress();
    await ticketNFT.connect(addr1).approve(marketplaceAddress, 0);
    await expect(
      marketplace.connect(addr1).listTicket(0, ethers.parseEther("1.5"))
    ).to.be.revertedWith("Price exceeds maximum allowed");
  });

  it("should allow buyer to purchase a listed ticket", async function () {
    await ticketNFT.mint(addr1.address);
    const marketplaceAddress = await marketplace.getAddress();
    await ticketNFT.connect(addr1).approve(marketplaceAddress, 0);
    await marketplace.connect(addr1).listTicket(0, ethers.parseEther("0.5"));

    await expect(() =>
      marketplace
        .connect(addr2)
        .buyTicket(0, { value: ethers.parseEther("0.5") })
    ).to.changeEtherBalances(
      [addr1, addr2, owner],
      [
        ethers.parseEther("0.45"),
        ethers.parseEther("-0.5"),
        ethers.parseEther("0.05"),
      ]
    );

    expect(await ticketNFT.ownerOf(0)).to.equal(addr2.address);
  });

  it("should enforce correct royalty payments on purchase", async function () {
    await ticketNFT.mint(addr1.address);
    const marketplaceAddress = await marketplace.getAddress();
    await ticketNFT.connect(addr1).approve(marketplaceAddress, 0);
    await marketplace.connect(addr1).listTicket(0, ethers.parseEther("0.5"));

    await expect(() =>
      marketplace
        .connect(addr2)
        .buyTicket(0, { value: ethers.parseEther("0.5") })
    ).to.changeEtherBalances(
      [addr1, addr2, owner],
      [
        ethers.parseEther("0.45"),
        ethers.parseEther("-0.5"),
        ethers.parseEther("0.05"),
      ]
    );
  });

  it("should allow seller to cancel a listing", async function () {
    await ticketNFT.mint(addr1.address);
    const marketplaceAddress = await marketplace.getAddress();
    await ticketNFT.connect(addr1).approve(marketplaceAddress, 0);
    await marketplace.connect(addr1).listTicket(0, ethers.parseEther("0.5"));

    await marketplace.connect(addr1).cancelListing(0);

    const listing = await marketplace.listings(0);
    expect(listing.price).to.equal(0);
    expect(listing.seller).to.equal(ZeroAddress);
  });

  it("should allow users to place bids and store the highest bid", async function () {
    await ticketNFT.mint(addr1.address);
    const marketplaceAddress = await marketplace.getAddress();
    await ticketNFT.connect(addr1).approve(marketplaceAddress, 0);
    await marketplace.connect(addr1).listTicket(0, ethers.parseEther("0.5"));

    await marketplace
      .connect(addr2)
      .placeBid(0, { value: ethers.parseEther("0.6") });

    const highestBid = await marketplace.highestBids(0);
    expect(highestBid.bidder).to.equal(addr2.address);
    expect(highestBid.amount).to.equal(ethers.parseEther("0.6"));
  });

  it("should allow seller to accept the highest bid", async function () {
    await ticketNFT.mint(addr1.address);
    const marketplaceAddress = await marketplace.getAddress();
    await ticketNFT.connect(addr1).approve(marketplaceAddress, 0);
    await marketplace.connect(addr1).listTicket(0, ethers.parseEther("0.5"));

    // Place bid
    await marketplace
      .connect(addr2)
      .placeBid(0, { value: ethers.parseEther("0.6") });

    // Accept bid and verify balance changes
    await expect(() =>
      marketplace.connect(addr1).acceptBid(0)
    ).to.changeEtherBalances(
      [addr1, owner],
      [
        ethers.parseEther("0.54"), // 90% of 0.6 ETH
        ethers.parseEther("0.06"), // 10% of 0.6 ETH
      ]
    );

    // Verify NFT ownership
    expect(await ticketNFT.ownerOf(0)).to.equal(addr2.address);
  });
});
