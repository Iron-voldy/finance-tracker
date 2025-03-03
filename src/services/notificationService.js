const Notification = require("../models/notificationModel");

// ✅ Create a Notification
exports.createNotification = async (userId, message, type) => {
    try {
        const notification = new Notification({ user: userId, message, type });
        await notification.save();
    } catch (error) {
        console.error("❌ Error creating notification:", error.message);
    }
};

// ✅ Send Budget Exceeded Notification
exports.checkBudgetExceeded = async (userId, category, spent, budget) => {
    if (spent > budget) {
        await exports.createNotification(
            userId,
            `You exceeded your budget for '${category}'.`,
            "budget"
        );
    }
};
