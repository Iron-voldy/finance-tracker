const Goal = require("../models/goalModel");
const { checkGoalStatus } = require("../services/goalService");

// ✅ Create a Savings Goal
exports.createGoal = async (req, res) => {
    try {
        const { name, targetAmount, deadline } = req.body;
        const goal = new Goal({ user: req.user, name, targetAmount, deadline });
        await goal.save();
        res.status(201).json(goal);
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

// ✅ Get All User Goals
exports.getGoals = async (req, res) => {
    try {
        const goals = await Goal.find({ user: req.user }).sort({ deadline: 1 });
        res.json(goals);
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

// ✅ Update a Goal
exports.updateGoal = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);
        if (!goal || goal.user.toString() !== req.user) {
            return res.status(404).json({ msg: "Goal not found" });
        }

        goal.name = req.body.name || goal.name;
        goal.targetAmount = req.body.targetAmount || goal.targetAmount;
        goal.deadline = req.body.deadline || goal.deadline;

        await goal.save();
        res.json({ msg: "Goal updated successfully", goal });
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

// ✅ Delete a Goal
exports.deleteGoal = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);
        if (!goal || goal.user.toString() !== req.user) {
            return res.status(404).json({ msg: "Goal not found" });
        }

        await goal.deleteOne();
        res.json({ msg: "Goal deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

// ✅ Allocate Money to a Goal
exports.allocateSavingsToGoal = async (req, res) => {
    try {
        const { amount } = req.body;
        const goal = await Goal.findById(req.params.id);
        if (!goal || goal.user.toString() !== req.user) {
            return res.status(404).json({ msg: "Goal not found" });
        }

        goal.savedAmount += amount;
        await goal.save();

        // ✅ Check if goal is reached
        await checkGoalStatus(goal);

        res.json({ msg: "Savings allocated successfully", goal });
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};
