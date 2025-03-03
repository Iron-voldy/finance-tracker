const express = require("express");
const {
    createTransaction,
    getAllTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction
} = require("../controllers/transactionController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", protect, createTransaction); 
router.get("/", protect, getAllTransactions); 
router.get("/:id", protect, getTransactionById); 
router.put("/:id", protect, updateTransaction); 
router.delete("/:id", protect, deleteTransaction); 

module.exports = router;
