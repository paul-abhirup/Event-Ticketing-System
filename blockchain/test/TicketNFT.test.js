const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TicketNFT", function () {
  let TicketNFT, ticketNFT, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    TicketNFT = await ethers.getContractFactory("TicketNFT");
    ticketNFT = await TicketNFT.deploy(
      "EventTicket", // Token name
      "TKT", // Token symbol
      "https://example.com/", // Base URI
      5, // Maximum tickets per wallet
      owner.address // Initial owner address
    );
    await ticketNFT.waitForDeployment();
  });

  it("should have correct name and symbol", async function () {
    expect(await ticketNFT.name()).to.equal("EventTicket");
    expect(await ticketNFT.symbol()).to.equal("TKT");
  });

  it("should set the correct base URI", async function () {
    expect(await ticketNFT.baseURI()).to.equal("https://example.com/");
  });

  it("should allow owner to mint tickets", async function () {
    await ticketNFT.mint(addr1.address);
    expect(await ticketNFT.ownerOf(0)).to.equal(addr1.address);
  });

  it("should not allow minting beyond maxTicketsPerWallet", async function () {
    for (let i = 0; i < 5; i++) {
      await ticketNFT.mint(addr1.address);
    }
    await expect(ticketNFT.mint(addr1.address)).to.be.revertedWith(
      "Max tickets per wallet reached"
    );
  });

  it("should update the base URI by the owner", async function () {
    await ticketNFT.setBaseURI("https://newexample.com/");
    expect(await ticketNFT.baseURI()).to.equal("https://newexample.com/");
  });

  it("should prevent non-owners from minting", async function () {
    await expect(
      ticketNFT.connect(addr1).mint(addr2.address)
    ).to.be.revertedWithCustomError(ticketNFT, "OwnableUnauthorizedAccount");
  });

  it("should prevent non-owners from changing the base URI", async function () {
    await expect(
      ticketNFT.connect(addr1).setBaseURI("https://newexample.com/")
    ).to.be.revertedWithCustomError(ticketNFT, "OwnableUnauthorizedAccount");
  });
});
