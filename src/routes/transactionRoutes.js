const express = require("express");
const {
    createTransaction,
    getAllTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction
} = require("../controllers/transactionController");

const {
    getUpcomingRecurringTransactions,
    runRecurringTransactions
} = require("../controllers/transactionController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", protect, createTransaction); 
router.get("/", protect, getAllTransactions); 
router.get("/:id", protect, getTransactionById); 
router.put("/:id", protect, updateTransaction); 
router.delete("/:id", protect, deleteTransaction); 

router.get("/recurring/upcoming", protect, getUpcomingRecurringTransactions);
router.post("/recurring/process", protect, runRecurringTransactions);

module.exports = router;
