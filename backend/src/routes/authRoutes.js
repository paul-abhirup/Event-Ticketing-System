const express = require("express");
const router = express.Router();
const { getNonce, connectWallet } = require("../controllers/authController");

// Route to get nonce
router.post("/nonce", getNonce);

// Route to connect wallet
router.post("/connect", connectWallet);

module.exports = router;
