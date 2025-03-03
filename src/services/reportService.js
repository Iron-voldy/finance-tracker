const Transaction = require("../models/transactionModel");
const mongoose = require("mongoose");

exports.getMonthlySpending = async (userId) => {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
    
    const userObjectId = new mongoose.Types.ObjectId(userId);
    
    return await Transaction.aggregate([
        {
            $match: {
                user: userObjectId,
                type: "expense",
                date: { $gte: startOfMonth, $lte: endOfMonth }
            }
        },
        {
            $group: {
                _id: "$category",
                totalSpent: { $sum: "$amount" }
            }
        },
        {
            $lookup: {
                from: "categories",
                localField: "_id",
                foreignField: "_id",
                as: "categoryDetails"
            }
        },
        {
            $project: {
                category: { $arrayElemAt: ["$categoryDetails.name", 0] },
                totalSpent: 1,
                _id: 0
            }
        }
    ]);
};