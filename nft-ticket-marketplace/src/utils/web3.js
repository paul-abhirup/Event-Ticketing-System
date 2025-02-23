import { React, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3005";

const LoginPage = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
        console.log(address, message);
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
    <div className="bg-background-base min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-holographic-white text-4xl font-bold mb-8">
        Connect Your Wallet
      </h1>
      <button
        onClick={connectWallet}
        className="bg-gradient-to-r from-electric-blue to-cyber-purple text-white px-6 py-3 rounded-lg font-semibold shadow-neon hover:scale-105 transition-transform"
      >
        Connect MetaMask
      </button>
      {error && <p className="text-plasma-pink mt-4">{error}</p>}
    </div>
  );
};

export default LoginPage;
