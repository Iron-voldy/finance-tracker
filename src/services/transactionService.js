const Transaction = require("../models/transactionModel");

// ✅ Process Recurring Transactions
exports.processRecurringTransactions = async () => {
    const now = new Date();
    
    const recurringTransactions = await Transaction.find({
        isRecurring: true,
        nextRecurringDate: { $lte: now }
    });

    for (const transaction of recurringTransactions) {
        const newTransaction = new Transaction({
            user: transaction.user,
            type: transaction.type,
            amount: transaction.amount,
            category: transaction.category,
            description: transaction.description,
            isRecurring: true,
            recurringInterval: transaction.recurringInterval,
            nextRecurringDate: calculateNextDate(transaction.recurringInterval)
        });

        await newTransaction.save();
    }
};

// ✅ Helper Function: Calculate Next Recurring Date
const calculateNextDate = (interval) => {
    const now = new Date();
    if (interval === "daily") return new Date(now.setDate(now.getDate() + 1));
    if (interval === "weekly") return new Date(now.setDate(now.getDate() + 7));
    if (interval === "monthly") return new Date(now.setMonth(now.getMonth() + 1));
    if (interval === "yearly") return new Date(now.setFullYear(now.getFullYear() + 1));
    return null;
};
