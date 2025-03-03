const express = require("express");
const { updatePreferredCurrency, getPreferredCurrency, convertToPreferredCurrency } = require("../controllers/currencyController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.put("/", protect, updatePreferredCurrency);
router.get("/", protect, getPreferredCurrency);
router.post("/convert", protect, convertToPreferredCurrency);

module.exports = router;
