const Transaction = require("../models/transactionModel");
const Category = require("../models/categoryModel");
const mongoose = require("mongoose");

exports.getExpenseTrends = async (user) => {
    try {
        if (!user || !user._id) {
            console.error("Invalid user object:", user);
            return [];
        }
        
        console.log("User in expense trends service:", user._id);
        
        const userObjectId = new mongoose.Types.ObjectId(user._id);
        
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1); 
        
        console.log("Looking for transactions since:", sixMonthsAgo);
        
        const expenseCount = await Transaction.countDocuments({
            user: userObjectId,
            type: "expense"
        });
        
        console.log(`Found ${expenseCount} expense transactions for user`);
        
        if (expenseCount === 0) {
            return [];
        }
        
        const result = await Transaction.aggregate([
            {
                $match: {
                    user: userObjectId,
                    type: "expense",
                    date: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: { month: { $month: "$date" }, year: { $year: "$date" } },
                    totalSpent: { $sum: "$amount" }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            },
            {
                $project: {
                    _id: 0,
                    month: "$_id.month",
                    year: "$_id.year",
                    totalSpent: 1
                }
            }
        ]);
        
        console.log("Expense trends aggregation result:", result);
        return result;
    } catch (error) {
        console.error("Error in getExpenseTrends service:", error);
        return [];
    }
};

exports.getIncomeTrends = async (user) => {
    try {
        if (!user || !user._id) {
            console.error("Invalid user object:", user);
            return [];
        }
        
        const userObjectId = new mongoose.Types.ObjectId(user._id);
        
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1); 
        
        const incomeCount = await Transaction.countDocuments({
            user: userObjectId,
            type: "income"
        });
        
        console.log(`Found ${incomeCount} income transactions for user`);
        
        if (incomeCount === 0) {
            return [];
        }
        
        const result = await Transaction.aggregate([
            {
                $match: {
                    user: userObjectId,
                    type: "income",
                    date: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: { month: { $month: "$date" }, year: { $year: "$date" } },
                    totalIncome: { $sum: "$amount" }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            },
            {
                $project: {
                    _id: 0,
                    month: "$_id.month",
                    year: "$_id.year",
                    totalIncome: 1
                }
            }
        ]);
        
        console.log("Income trends aggregation result:", result);
        return result;
    } catch (error) {
        console.error("Error in getIncomeTrends service:", error);
        return [];
    }
};

exports.detectUnusualSpending = async (user) => {
    try {
        if (!user || !user._id) {
            console.error("Invalid user object:", user);
            return [];
        }
        
        const userObjectId = new mongoose.Types.ObjectId(user._id);
        
        const now = new Date();
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        
        console.log("Last month:", lastMonth);
        console.log("This month:", thisMonth);
        
        const lastMonthData = await Transaction.aggregate([
            { 
                $match: { 
                    user: userObjectId, 
                    type: "expense", 
                    date: { $gte: lastMonth, $lt: thisMonth } 
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
                    totalSpent: 1,
                    categoryName: { $arrayElemAt: ["$categoryDetails.name", 0] }
                }
            }
        ]);
        
        const thisMonthData = await Transaction.aggregate([
            { 
                $match: { 
                    user: userObjectId, 
                    type: "expense", 
                    date: { $gte: thisMonth } 
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
                    totalSpent: 1,
                    categoryName: { $arrayElemAt: ["$categoryDetails.name", 0] }
                }
            }
        ]);
        
        console.log("Last month spending data:", lastMonthData);
        console.log("This month spending data:", thisMonthData);
        
        const unusualSpending = [];
        
        thisMonthData.forEach((thisMonthExpense) => {
            const lastMonthExpense = lastMonthData.find(e => e._id.toString() === thisMonthExpense._id.toString());
            
            if (lastMonthExpense && lastMonthExpense.totalSpent > 0) {
                const percentageIncrease = ((thisMonthExpense.totalSpent - lastMonthExpense.totalSpent) / lastMonthExpense.totalSpent) * 100;
                
                if (percentageIncrease > 50) {
                    unusualSpending.push({
                        category: thisMonthExpense.categoryName || "Unknown category",
                        currentSpending: thisMonthExpense.totalSpent,
                        previousSpending: lastMonthExpense.totalSpent,
                        increasePercentage: percentageIncrease.toFixed(2),
                        message: `You spent ${percentageIncrease.toFixed(2)}% more on ${thisMonthExpense.categoryName || "Unknown category"} compared to last month.`
                    });
                }
            }
        });
        
        console.log("Unusual spending result:", unusualSpending);
        return unusualSpending;
    } catch (error) {
        console.error("Error in detectUnusualSpending service:", error);
        return [];
    }
};