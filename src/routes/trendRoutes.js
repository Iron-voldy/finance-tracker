const express = require("express");
const { getExpenseTrends, getIncomeTrends, getUnusualSpending } = require("../controllers/trendController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/expenses", protect, getExpenseTrends);
router.get("/income", protect, getIncomeTrends);
router.get("/unusual-spending", protect, getUnusualSpending);

module.exports = router;