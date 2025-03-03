const Transaction = require("../models/transactionModel");
const Category = require("../models/categoryModel");
const { processRecurringTransactions } = require("../services/transactionService");
const { createNotification, checkBudgetExceeded } = require("../services/notificationService");
const Budget = require("../models/budgetModel");

exports.createTransaction = async (req, res) => {
    try {
        const { type, amount, categoryId, description, isRecurring, recurringInterval } = req.body;

        const category = await Category.findOne({ _id: categoryId, user: req.user });
        if (!category) {
            return res.status(404).json({ msg: "Category not found" });
        }

        const transaction = new Transaction({
            user: req.user,
            type,
            amount,
            category: categoryId,
            description,
            isRecurring,
            recurringInterval,
            nextRecurringDate: isRecurring ? calculateNextDate(recurringInterval) : null
        });

        await transaction.save();

        if (type === "income") {
            await createNotification(req.user, `You received an income of $${amount}.`, "income");
        }

        if (type === "expense") {
            const budget = await Budget.findOne({ user: req.user, category: categoryId });
            if (budget) {
                budget.spent += amount;
                await budget.save();
                await checkBudgetExceeded(req.user, category.name, budget.spent, budget.amount);
            }
        }

        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user })
            .populate("category", "name type") 
            .sort({ date: -1 });

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

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

exports.updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction || transaction.user.toString() !== req.user) {
            return res.status(404).json({ msg: "Transaction not found" });
        }

        const { amount, categoryId, description, isRecurring, recurringInterval } = req.body;

        if (categoryId) {
            const category = await Category.findOne({ _id: categoryId, user: req.user });
            if (!category) {
                return res.status(404).json({ msg: "Category not found" });
            }
            transaction.category = categoryId;
        }

        if (amount) transaction.amount = amount;
        if (description) transaction.description = description;

        if (isRecurring !== undefined) {
            transaction.isRecurring = isRecurring;
            transaction.recurringInterval = isRecurring ? recurringInterval : null;
            transaction.nextRecurringDate = isRecurring ? calculateNextDate(recurringInterval) : null;
        }

        await transaction.save();
        res.json({ msg: "Transaction updated successfully", transaction });
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

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

exports.getUpcomingRecurringTransactions = async (req, res) => {
    try {
        const upcomingTransactions = await Transaction.find({
            user: req.user,
            isRecurring: true,
            nextRecurringDate: { $gte: new Date() }
        }).sort({ nextRecurringDate: 1 });

        res.json(upcomingTransactions);
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

exports.runRecurringTransactions = async (req, res) => {
    try {
        await processRecurringTransactions();
        res.json({ msg: "Recurring transactions processed successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

const calculateNextDate = (interval) => {
    const now = new Date();
    if (interval === "daily") return new Date(now.setDate(now.getDate() + 1));
    if (interval === "weekly") return new Date(now.setDate(now.getDate() + 7));
    if (interval === "monthly") return new Date(now.setMonth(now.getMonth() + 1));
    if (interval === "yearly") return new Date(now.setFullYear(now.getFullYear() + 1));
    return null;
};
