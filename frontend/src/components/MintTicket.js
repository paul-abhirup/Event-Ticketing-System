import React, { useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import TicketNFT from "../TicketNFT.json"; // Import ABI

const API_URL = process.env.REACT_APP_API_URL;

const MintTicket = () => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const mintTickets = async () => {
    try {
      setLoading(true);
      setError("");

      // Validate quantity
      const numQuantity = parseInt(quantity);
      if (isNaN(numQuantity) || numQuantity < 1) {
        throw new Error("Please enter a valid quantity");
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please connect your wallet first");
      }

      // Get provider and signer first
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      // Create and log the request payload
      const payload = {
        quantity: numQuantity,
        recipientAddress: address, // Add recipient address
      };

      console.log("Request details:", {
        url: `${API_URL}/tickets/mint`,
        payload,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Call backend API to mint
      const response = await axios.post(`${API_URL}/tickets/mint`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Mint response:", response.data);

      // Initialize contract
      const ticketContract = new ethers.Contract(
        process.env.REACT_APP_TICKET_NFT_ADDRESS,
        TicketNFT.abi,
        signer
      );

      // Log available functions
      console.log("Contract functions:", ticketContract.interface.fragments);

      // Mint tickets - CHOOSE ONLY ONE VERSION BASED ON YOUR CONTRACT
      // Version 1: If mint only takes quantity
      // const tx = await ticketContract.mint(numQuantity);

      // Version 2: If using safeMint with address and quantity
      const tx = await ticketContract.safeMint(address, numQuantity);

      // Version 3: If mint takes address, quantity, and data
      // const tx = await ticketContract.mint(address, numQuantity, "");

      const receipt = await tx.wait();

      alert(`Successfully minted ${numQuantity} ticket(s)!`);
    } catch (err) {
      console.error("Mint error:", err);
      setError(
        err.response?.data?.message || err.message || "Error minting tickets"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    const num = parseInt(value);
    if (!isNaN(num) && num >= 1) {
      setQuantity(num);
    } else if (value === "") {
      setQuantity(1);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Mint Tickets</h2>
      <div className="max-w-md">
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={handleQuantityChange}
          className="border p-2 rounded w-full mb-4"
        />
        <button
          onClick={mintTickets}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {loading ? "Minting..." : "Mint Tickets"}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default MintTicket;
