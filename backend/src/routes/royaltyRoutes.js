const express = require("express");
const { getRoyalties } = require("../controllers/royaltyController");

const router = express.Router();

router.get("/:organizer", getRoyalties);

module.exports = router;
