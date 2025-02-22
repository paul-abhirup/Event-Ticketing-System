// src/controllers/authController.js
const jwt = require("jsonwebtoken");
const supabase = require("../services/supabaseService");
const ethers = require("ethers");

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

const connectWallet = async (req, res) => {
  const { walletAddress, signature } = req.body;

  // Input validation
  if (!walletAddress || !signature) {
    return res.status(400).json({
      message: "Wallet address and signature are required",
    });
  }

  // Validate wallet address format
  if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
    return res.status(400).json({
      message: "Invalid wallet address format",
    });
  }

  try {
    // Verify the signature (pseudo-code)
    const isValid = await verifySignature(walletAddress, signature);
    if (!isValid) throw new Error("Invalid signature");

    // Check if user exists in Supabase
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("wallet_address", walletAddress)
      .single();

    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        // User not found - continue to creation
      } else if (fetchError.code === "23505") {
        // Unique violation
        throw new Error("Wallet address already registered");
      } else {
        console.error("Supabase Error:", fetchError);
        throw new Error("Database error while checking user");
      }
    }

    // If user doesn't exist, create new user
    if (!existingUser) {
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert([
          {
            wallet_address: walletAddress,
            created_at: new Date().toISOString(),
            last_login: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (insertError) throw new Error("Error creating user");
    } else {
      // Update last login time for existing user
      const { error: updateError } = await supabase
        .from("users")
        .update({ last_login: new Date().toISOString() })
        .eq("wallet_address", walletAddress);

      if (updateError) throw new Error("Error updating user login time");
    }

    // Generate JWT
    const token = jwt.sign({ walletAddress }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      token,
      user: existingUser || newUser,
      message: existingUser ? "Welcome back!" : "Account created successfully!",
    });
  } catch (error) {
    console.error("Auth Error:", error);

    // Handle specific error types
    if (error.message.includes("Database error")) {
      return res.status(503).json({
        message: "Database service unavailable",
        error: process.env.NODE_ENV === "development" ? error : undefined,
      });
    }

    if (error.message.includes("Invalid signature")) {
      return res.status(401).json({
        message: "Invalid signature",
        error: process.env.NODE_ENV === "development" ? error : undefined,
      });
    }

    // Generic error response
    res.status(500).json({
      message: "An error occurred during authentication",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

// Helper function to verify signature
const verifySignature = async (address, signature) => {
  try {
    // The message that was signed
    const message = `Welcome to Event Ticketing System! Click to sign in.\n\nWallet: ${address}\nNonce: ${Date.now()}`;

    // Recover the address from the signature
    const recoveredAddress = ethers.verifyMessage(message, signature);

    // Check if the recovered address matches the provided address
    return recoveredAddress.toLowerCase() === address.toLowerCase();
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
};

const generateTokens = (walletAddress) => {
  const accessToken = jwt.sign({ walletAddress }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign(
    { walletAddress },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return { accessToken, refreshToken };
};

module.exports = { connectWallet };
