import React, { useState } from "react";
import { ethers } from "ethers";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3005";

const ConnectWallet = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [message, setMessage] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Clear existing token on new connection attempt
        localStorage.removeItem("token");

        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);

        console.log("Connecting to API at:", API_URL); // Debug log

        // Step 1: Get a nonce from the backend
        const nonceResponse = await axios.post(`${API_URL}/auth/nonce`, {
          walletAddress: address,
        });

        if (!nonceResponse.data?.data?.nonce) {
          throw new Error("Invalid nonce response");
        }

        const nonce = nonceResponse.data.data.nonce;
        console.log("Received nonce:", nonce); // Debug log

        // Step 2: Sign the nonce
        const signedMessage = await signer.signMessage(nonce);
        console.log("Signed message:", signedMessage); // Debug log

        // Step 3: Send the signed message to the backend
        const authResponse = await axios.post(`${API_URL}/auth/connect`, {
          walletAddress: address,
          signature: signedMessage,
        });

        // Store the token properly
        const { token } = authResponse.data.data;
        console.log("Received token:", token);
        localStorage.setItem("token", token);

        // Force state update and clear any previous errors
        setWalletAddress(address);
        setMessage("Wallet connected and authenticated successfully!");
        navigate("/home");
      } catch (error) {
        console.error("Connection error:", error);
        const errorMessage = error.response?.data?.message || error.message;
        console.log("Error details:", {
          status: error.response?.status,
          data: error.response?.data,
          message: errorMessage,
        });
        setMessage(`Error connecting wallet: ${errorMessage}`);
        localStorage.removeItem("token");
      }
    } else {
      setMessage("MetaMask is not installed.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Connect Wallet</h2>
      <div className="max-w-md">
        <button
          onClick={connectWallet}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Connect Wallet
        </button>
        {walletAddress && (
          <p className="mt-4">Connected Address: {walletAddress}</p>
        )}
        {message && (
          <p
            className={
              message.includes("Error") ? "text-red-500" : "text-green-500"
            }
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ConnectWallet;
