const Goal = require("../models/goalModel");
const { checkGoalStatus } = require("../services/goalService");

exports.createGoal = async (req, res) => {
    try {
        const { name, targetAmount, deadline } = req.body;
        const goal = new Goal({ 
            user: req.user, 
            name, 
            targetAmount, 
            deadline 
        });
        
        await goal.save();
        res.status(201).json(goal);
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

exports.getGoals = async (req, res) => {
    try {
        const goals = await Goal.find({ user: req.user }).sort({ deadline: 1 });
        res.status(200).json(goals);
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

exports.updateGoal = async (req, res) => {
    try {
        const goal = await Goal.findOne({
            _id: req.params.id,
            user: req.user
        });
        
        if (!goal) {
            return res.status(404).json({ msg: "Goal not found" });
        }

        goal.name = req.body.name || goal.name;
        goal.targetAmount = req.body.targetAmount || goal.targetAmount;
        goal.deadline = req.body.deadline || goal.deadline;

        await goal.save();
        res.status(200).json({ msg: "Goal updated successfully", goal });
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

exports.deleteGoal = async (req, res) => {
    try {
        const goal = await Goal.findOne({
            _id: req.params.id,
            user: req.user
        });
        
        if (!goal) {
            return res.status(404).json({ msg: "Goal not found" });
        }

        await goal.deleteOne();
        res.status(200).json({ msg: "Goal deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

exports.allocateSavingsToGoal = async (req, res) => {
    try {
        const { amount } = req.body;
        const goal = await Goal.findOne({
            _id: req.params.id,
            user: req.user
        });
        
        if (!goal) {
            return res.status(404).json({ msg: "Goal not found" });
        }

        goal.savedAmount += amount;
        await goal.save();

        await checkGoalStatus(goal);

        res.status(200).json({ msg: "Savings allocated successfully", goal });
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};