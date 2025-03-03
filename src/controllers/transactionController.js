const Transaction = require("../models/transactionModel");
const Category = require("../models/categoryModel");

// ✅ Create a New Transaction with Category Validation
exports.createTransaction = async (req, res) => {
    try {
        const { type, amount, categoryId, description, isRecurring, recurringInterval } = req.body;

        // ✅ Validate if the category exists for this user
        const category = await Category.findOne({ _id: categoryId, user: req.user });
        if (!category) {
            return res.status(404).json({ msg: "Category not found" });
        }

        const transaction = new Transaction({
            user: req.user,
            type,
            amount,
            category: categoryId, // ✅ Store category as ObjectId
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

// ✅ Get All Transactions with Category Details
exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user })
            .populate("category", "name type") // ✅ Populate category name & type
            .sort({ date: -1 });

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

// ✅ Get Single Transaction with Category Details
exports.getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id).populate("category", "name type");
        if (!transaction || transaction.user.toString() !== req.user) {
            return res.status(404).json({ msg: "Transaction not found" });
        }
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

// ✅ Update a Transaction with Category Validation
exports.updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction || transaction.user.toString() !== req.user) {
            return res.status(404).json({ msg: "Transaction not found" });
        }

        const { amount, categoryId, description } = req.body;

        // ✅ Validate category change
        if (categoryId) {
            const category = await Category.findOne({ _id: categoryId, user: req.user });
            if (!category) {
                return res.status(404).json({ msg: "Category not found" });
            }
            transaction.category = categoryId;
        }

        if (amount) transaction.amount = amount;
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
