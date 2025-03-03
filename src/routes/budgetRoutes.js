const express = require("express");
const { createBudget, getBudgets, deleteBudget } = require("../controllers/budgetController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", protect, createBudget);
router.get("/", protect, getBudgets);
router.delete("/:id", protect, deleteBudget);

module.exports = router;
