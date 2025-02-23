import React, { useState } from "react";

// Extend the Window interface to include the ethereum property
declare global {
  interface Window {
    ethereum?: any;
  }
}

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import axios from "axios";
import { Wallet } from "lucide-react";
import { supabase } from "../lib/supabaseClient"; // Import Supabase client

const API_URL = import.meta.env.REACT_APP_API_URL || "http://localhost:3005";

const Login = () => {
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask!");
      }

      // Clear existing token on new connection attempt
      localStorage.removeItem("token");

      // Request account access
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

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

      // Step 3: Check if the user exists in Supabase
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("wallet_address", address)
        .single();

      if (userError && userError.code !== "PGRST116") {
        // PGRST116 = no rows found
        throw new Error("Error fetching user data from Supabase");
      }

      // If the user doesn't exist, create a new user in Supabase
      if (!user) {
        const { data: newUser, error: createUserError } = await supabase
          .from("users")
          .insert([
            {
              wallet_address: address,
              created_at: new Date().toISOString(),
              last_login: new Date().toISOString(),
            },
          ])
          .select()
          .single();

        if (createUserError) {
          throw new Error("Error creating user in Supabase");
        }

        console.log("New user created:", newUser); // Debug log
      }

      // Step 4: Send the signed message to the backend
      const authResponse = await axios.post(`${API_URL}/auth/connect`, {
        walletAddress: address,
        signature: signedMessage, // Use 'signature' instead of 'signedMessage'
      });

      // Store the token properly
      const { token } = authResponse.data.data;
      console.log("Received token:", token);
      localStorage.setItem("token", token);

      // Redirect to the dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Connection error:", error);
      const errorMessage =
        (error as any).response?.data?.message || (error as any).message;
      if (axios.isAxiosError(error)) {
        console.log("Error details:", {
          status: error.response?.status,
          data: error.response?.data,
          message: errorMessage,
        });
      } else {
        console.log("Error details:", {
          message: errorMessage,
        });
      }
      setError(`Error connecting wallet: ${errorMessage}`);
      localStorage.removeItem("token");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-cyber-purple/20 to-background animate-gradient-xy" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 bg-background/60 backdrop-blur-xl p-8 rounded-2xl border border-neon-blue/20 shadow-xl max-w-md w-full mx-4"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <Wallet className="w-16 h-16 text-neon-blue mx-auto mb-4" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-neon-blue to-cyber-purple bg-clip-text text-transparent">
            Connect Wallet
          </h2>
          <p className="text-holo-white/70 mt-2">
            Connect your wallet to access the TicketChain platform
          </p>
        </motion.div>

        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={connectWallet}
            className="w-full py-3 px-4 bg-gradient-to-r from-neon-blue to-cyber-purple rounded-lg font-medium text-white shadow-lg hover:shadow-neon-blue/50 transition-shadow flex items-center justify-center space-x-2"
          >
            <span>Connect with MetaMask</span>
          </motion.button>
        </div>

        {error && <p className="text-plasma-pink mt-4 text-center">{error}</p>}
      </motion.div>
    </div>
  );
};

export default Login;
