import React, { useState } from "react";
import axios from "axios";

const PurchaseTicket = () => {
  const [tokenId, setTokenId] = useState("");
  const [message, setMessage] = useState("");

  const purchaseTicket = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3005/marketplace/purchase",
        { tokenId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(
        "Ticket purchased successfully: " + JSON.stringify(response.data)
      );
    } catch (error) {
      setMessage("Error purchasing ticket: " + error.message);
    }
  };

  return (
    <div>
      <h2>Purchase Ticket</h2>
      <input
        type="text"
        placeholder="Token ID"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
      />
      <button onClick={purchaseTicket}>Purchase Ticket</button>
      <p>{message}</p>
    </div>
  );
};

export default PurchaseTicket;
