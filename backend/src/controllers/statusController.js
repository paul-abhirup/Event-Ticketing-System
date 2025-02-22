const { ethers } = require("ethers");

const getBlockchainStatus = async (req, res) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.BLOCKCHAIN_RPC_URL
    );
    const chainId = await provider
      .getNetwork()
      .then((network) => network.chainId);
    const latestBlock = await provider.getBlockNumber();
    const gasPrice = await provider.getGasPrice();

    res.status(200).json({
      chainId,
      latestBlock,
      gasPrice: gasPrice.toString(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBlockchainStatus };
