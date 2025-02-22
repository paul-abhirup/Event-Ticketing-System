const { ethers } = require("ethers");

const verifySignature = (message, signature, address) => {
  try {
    // Recover the address from the signed message
    const recoveredAddress = ethers.utils.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === address.toLowerCase();
  } catch (error) {
    console.error("Error verifying signature:", error);
    return false;
  }
};

module.exports = verifySignature;
