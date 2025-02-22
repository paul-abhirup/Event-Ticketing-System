import React, { useState } from "react";
import axios from "axios";

const ListTicket = () => {
  const [tokenId, setTokenId] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");

  const listTicket = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3005/marketplace/list",
        { tokenId, price },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(
        "Ticket listed successfully: " + JSON.stringify(response.data)
      );
    } catch (error) {
      setMessage("Error listing ticket: " + error.message);
    }
  };

  return (
    <div>
      <h2>List Ticket</h2>
      <input
        type="text"
        placeholder="Token ID"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button onClick={listTicket}>List Ticket</button>
      <p>{message}</p>
    </div>
  );
};

export default ListTicket;
