// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Marketplace is ReentrancyGuard {
    struct Listing {
        uint256 price;
        address seller;
    }

    struct Bid {
        address bidder;
        uint256 amount;
    }

    mapping(uint256 => Listing) public listings;
    mapping(uint256 => Bid) public highestBids;
    uint256 public maxResalePrice;
    address public organizer;
    uint256 public royaltyPercentage;
    IERC721 public ticketNFT;

    constructor(
        address _ticketNFT,
        uint256 _maxResalePrice,
        uint256 _royaltyPercentage
    ) {
        require(_ticketNFT != address(0), "Invalid ticket NFT address");
        ticketNFT = IERC721(_ticketNFT);
        maxResalePrice = _maxResalePrice;
        royaltyPercentage = _royaltyPercentage;
        organizer = msg.sender;
    }

    function listTicket(uint256 tokenId, uint256 price) external {
        require(price <= maxResalePrice, "Price exceeds maximum allowed");
        require(ticketNFT.ownerOf(tokenId) == msg.sender, "You do not own this ticket");

        ticketNFT.transferFrom(msg.sender, address(this), tokenId);
        listings[tokenId] = Listing(price, msg.sender);
    }

    function buyTicket(uint256 tokenId) external payable nonReentrant {
        Listing memory listing = listings[tokenId];
        require(msg.value >= listing.price, "Insufficient funds");

        uint256 royalty = (listing.price * royaltyPercentage) / 100;
        uint256 sellerProceeds = listing.price - royalty;

        payable(listing.seller).transfer(sellerProceeds);
        payable(organizer).transfer(royalty);

        ticketNFT.transferFrom(address(this), msg.sender, tokenId);
        delete listings[tokenId];
    }

    function cancelListing(uint256 tokenId) external {
        require(listings[tokenId].seller == msg.sender, "You are not the seller");
        ticketNFT.transferFrom(address(this), msg.sender, tokenId);
        delete listings[tokenId];
    }

    function placeBid(uint256 tokenId) external payable {
        require(msg.value > highestBids[tokenId].amount, "Bid too low");
        if (highestBids[tokenId].amount > 0) {
            payable(highestBids[tokenId].bidder).transfer(highestBids[tokenId].amount);
        }
        highestBids[tokenId] = Bid(msg.sender, msg.value);
    }

    function acceptBid(uint256 tokenId) external nonReentrant {
        require(listings[tokenId].seller == msg.sender, "You are not the seller");
        Bid memory winningBid = highestBids[tokenId];
        require(winningBid.amount > 0, "No bids placed");

        uint256 royalty = (winningBid.amount * royaltyPercentage) / 100;
        uint256 sellerProceeds = winningBid.amount - royalty;

        payable(msg.sender).transfer(sellerProceeds);
        payable(organizer).transfer(royalty);

        ticketNFT.transferFrom(address(this), winningBid.bidder, tokenId);
        delete highestBids[tokenId];
        delete listings[tokenId];
    }
}