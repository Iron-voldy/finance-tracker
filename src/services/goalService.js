const Goal = require("../models/goalModel");
const { createNotification } = require("./notificationService");

exports.checkGoalStatus = async (goal) => {
    if (goal.savedAmount >= goal.targetAmount) {
        goal.status = "completed";
        await goal.save();
        await createNotification(goal.user, `You achieved your savings goal: ${goal.name}!`, "goal");
    }
};
