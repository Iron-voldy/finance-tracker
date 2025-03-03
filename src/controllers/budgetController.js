const Budget = require("../models/budgetModel");
const Transaction = require("../models/transactionModel");

// ✅ Create a Budget
exports.createBudget = async (req, res) => {
    try {
        const { categoryId, amount } = req.body;

        const budget = new Budget({ user: req.user, category: categoryId, amount });
        await budget.save();
        res.status(201).json(budget);
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

// ✅ Get All Budgets
exports.getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ user: req.user }).populate("category", "name");
        res.json(budgets);
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

// ✅ Delete a Budget
exports.deleteBudget = async (req, res) => {
    try {
        await Budget.findByIdAndDelete(req.params.id);
        res.json({ msg: "Budget deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};
