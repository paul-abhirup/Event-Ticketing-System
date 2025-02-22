// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TicketNFT is ERC721, Ownable {
    uint256 public nextTokenId;
    string public baseURI; // State variable
    mapping(address => uint256) public ticketsPerWallet;
    uint256 public maxTicketsPerWallet;
    mapping(uint256 => bool) private _isUsed;

    constructor(
        string memory _name, // Token name
        string memory _symbol, // Token symbol
        string memory _uri, // Renamed parameter (was _baseURI)
        uint256 _maxTicketsPerWallet, // Maximum tickets per wallet
        address _initialOwner // Initial owner address
    ) ERC721(_name, _symbol) Ownable(_initialOwner) {
        baseURI = _uri; // Assign the parameter to the state variable
        maxTicketsPerWallet = _maxTicketsPerWallet;
    }

    function mint(address to) external onlyOwner {
        require(ticketsPerWallet[to] < maxTicketsPerWallet, "Max tickets per wallet reached");
        _safeMint(to, nextTokenId);
        nextTokenId++;
        ticketsPerWallet[to]++;
    }

    function setBaseURI(string memory _newBaseURI) external onlyOwner {
        baseURI = _newBaseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function isUsed(uint256 tokenId) public view returns (bool) {
    // Logic to check if the ticket is used
    return _isUsed[tokenId];
}
}