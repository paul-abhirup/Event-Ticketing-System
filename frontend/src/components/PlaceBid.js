import React, { useState } from "react";
import axios from "axios";

const PlaceBid = () => {
  const [tokenId, setTokenId] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const placeBid = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3005/marketplace/bid",
        { tokenId, amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Bid placed successfully: " + JSON.stringify(response.data));
    } catch (error) {
      setMessage("Error placing bid: " + error.message);
    }
  };

  return (
    <div>
      <h2>Place Bid</h2>
      <input
        type="text"
        placeholder="Token ID"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={placeBid}>Place Bid</button>
      <p>{message}</p>
    </div>
  );
};

export default PlaceBid;
