const express = require("express");
const { getBlockchainStatus } = require("../controllers/statusController");

const router = express.Router();

router.get("/blockchain", getBlockchainStatus);

module.exports = router;
