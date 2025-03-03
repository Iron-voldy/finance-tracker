const Transaction = require("../models/transactionModel");

// ✅ Create a New Transaction
exports.createTransaction = async (req, res) => {
    try {
        const { type, amount, category, description, isRecurring, recurringInterval } = req.body;

        const transaction = new Transaction({
            user: req.user,
            type,
            amount,
            category,
            description,
            isRecurring,
            recurringInterval
        });

        await transaction.save();
        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

// ✅ Get All Transactions for the Logged-in User
exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user }).sort({ date: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

// ✅ Get Single Transaction by ID
exports.getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction || transaction.user.toString() !== req.user) {
            return res.status(404).json({ msg: "Transaction not found" });
        }
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

// ✅ Update a Transaction
exports.updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction || transaction.user.toString() !== req.user) {
            return res.status(404).json({ msg: "Transaction not found" });
        }

        const { amount, category, description } = req.body;
        if (amount) transaction.amount = amount;
        if (category) transaction.category = category;
        if (description) transaction.description = description;

        await transaction.save();
        res.json({ msg: "Transaction updated successfully", transaction });
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

// ✅ Delete a Transaction
exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction || transaction.user.toString() !== req.user) {
            return res.status(404).json({ msg: "Transaction not found" });
        }

        await transaction.deleteOne();
        res.json({ msg: "Transaction deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};
