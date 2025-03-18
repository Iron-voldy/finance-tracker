const Transaction = require("../models/transactionModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");

exports.getAdminDashboard = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalTransactions = await Transaction.countDocuments();
        const totalIncome = await Transaction.aggregate([{ $match: { type: "income" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]);
        const totalExpenses = await Transaction.aggregate([{ $match: { type: "expense" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]);

        res.json({
            totalUsers,
            totalTransactions,
            totalIncome: totalIncome.length ? totalIncome[0].total : 0,
            totalExpenses: totalExpenses.length ? totalExpenses[0].total : 0,
        });
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

exports.getUserDashboard = async (req, res) => {
    try {
        // Convert string user ID to mongoose ObjectId
        const userObjectId = new mongoose.Types.ObjectId(req.user);
        
        const totalTransactions = await Transaction.countDocuments({ user: userObjectId });
        const totalIncome = await Transaction.aggregate([
            { $match: { user: userObjectId, type: "income" } }, 
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalExpenses = await Transaction.aggregate([
            { $match: { user: userObjectId, type: "expense" } }, 
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        res.json({
            totalTransactions,
            totalIncome: totalIncome.length ? totalIncome[0].total : 0,
            totalExpenses: totalExpenses.length ? totalExpenses[0].total : 0,
        });
    } catch (error) {
        console.error("Error in getUserDashboard:", error);
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};