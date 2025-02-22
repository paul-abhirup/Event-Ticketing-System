// src/controllers/authController.js
const jwt = require("jsonwebtoken");
const supabase = require("../services/supabaseService");
const ethers = require("ethers");

// Store nonces temporarily (consider using Redis in production)
const nonceStore = new Map();

const getNonce = async (req, res) => {
  const { walletAddress } = req.body;

  if (!walletAddress) {
    return res.status(400).json({
      message: "Wallet address is required",
    });
  }

  // Generate a random nonce
  const nonce = `Welcome to Event Ticketing System! Click to sign in.\n\nWallet: ${walletAddress}\nNonce: ${Date.now()}`;

  // Store the nonce
  nonceStore.set(walletAddress, nonce);

  res.status(200).json({
    data: { nonce },
  });
};

const connectWallet = async (req, res) => {
  const { walletAddress, signature } = req.body;

  try {
    console.log("Received request:", { walletAddress, signature });

    // Basic validation
    if (!walletAddress || !signature) {
      return res.status(400).json({
        message: "Wallet address and signature are required",
      });
    }

    // Get stored nonce
    const nonce = nonceStore.get(walletAddress);
    console.log("Retrieved nonce:", nonce);

    if (!nonce) {
      nonceStore.delete(walletAddress); // Cleanup any potential stale entries
      return res.status(400).json({
        message: "Nonce expired or not found. Please request a new nonce.",
      });
    }

    // Verify signature
    try {
      console.log("Verifying signature with nonce:", nonce);
      const recoveredAddress = ethers.verifyMessage(nonce, signature);
      console.log("Recovered address:", recoveredAddress);

      if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
        return res.status(401).json({
          message: "Invalid signature",
          expected: walletAddress.toLowerCase(),
          got: recoveredAddress.toLowerCase(),
        });
      }
    } catch (error) {
      console.error("Signature verification error:", error);
      return res.status(401).json({
        message: "Invalid signature",
        error: error.message,
      });
    }

    // Clear used nonce
    nonceStore.delete(walletAddress);

    // Check if user exists in Supabase
    console.log("Checking user in Supabase");
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("wallet_address", walletAddress)
      .single();

    if (fetchError) {
      console.error("Supabase fetch error:", fetchError);
      if (fetchError.code !== "PGRST116") {
        throw new Error(`Database error: ${fetchError.message}`);
      }
    }

    let user = existingUser;

    // If user doesn't exist, create new user
    if (!existingUser) {
      console.log("Creating new user");
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert({
          wallet_address: walletAddress,
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) {
        console.error("Supabase insert error:", insertError);
        throw new Error(`Error creating user: ${insertError.message}`);
      }
      user = newUser;
    } else {
      console.log("Updating existing user");
      // First update the user
      const { error: updateError } = await supabase
        .from("users")
        .update({
          last_login: new Date().toISOString(),
        })
        .eq("wallet_address", walletAddress);

      if (updateError) {
        console.error("Supabase update error:", updateError);
        throw new Error(`Error updating user: ${updateError.message}`);
      }

      // Then fetch the updated user
      const { data: updatedUser, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("wallet_address", walletAddress)
        .single();

      if (fetchError) {
        console.error("Error fetching updated user:", fetchError);
        throw new Error(`Error fetching updated user: ${fetchError.message}`);
      }

      user = updatedUser;
    }

    // Generate JWT
    const token = jwt.sign(
      {
        walletAddress,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3 * 60 * 60, // 3 hours in seconds
      },
      process.env.JWT_SECRET
    );

    console.log("Generated token:", token);

    console.log("Authentication successful");
    res.status(200).json({
      data: {
        token,
        user,
        message: existingUser
          ? "Welcome back!"
          : "Account created successfully!",
      },
    });
  } catch (error) {
    console.error("Auth Error:", error);
    nonceStore.delete(walletAddress); // Cleanup on error
    res.status(500).json({
      message: error.message || "An error occurred during authentication",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

module.exports = { getNonce, connectWallet };
