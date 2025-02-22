const { ethers } = require("ethers");

// Custom JSON serializer to handle BigInt
function serializeBigInt(key, value) {
  return typeof value === "bigint" ? value.toString() : value;
}

const getBlockchainStatus = async (req, res) => {
  try {
    const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
    const chainId = (await provider.getNetwork()).chainId;
    const latestBlock = await provider.getBlockNumber();
    const feeData = await provider.getFeeData();

    const response = {
      chainId,
      latestBlock,
      gasPrice: feeData.gasPrice, // This is a BigInt
    };

    // Use the custom serializer
    res.status(200).send(JSON.stringify(response, serializeBigInt));
  } catch (error) {
    console.error("Error in getBlockchainStatus:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBlockchainStatus };
