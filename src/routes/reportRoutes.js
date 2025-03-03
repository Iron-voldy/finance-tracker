const express = require("express");
const { getMonthlySpendingReport } = require("../controllers/reportController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/monthly-spending", protect, getMonthlySpendingReport);

module.exports = router;
