// src/controllers/authController.js
const jwt = require("jsonwebtoken");
const supabase = require("../services/supabaseService");

const connectWallet = async (req, res) => {
  const { walletAddress, signature } = req.body;
  try {
    // Verify the signature (pseudo-code)
    const isValid = verifySignature(walletAddress, signature);
    if (!isValid) throw new Error("Invalid signature");

    // Generate JWT
    const token = jwt.sign({ walletAddress }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { connectWallet };
