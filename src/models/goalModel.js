const mongoose = require("mongoose");

const GoalSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    savedAmount: { type: Number, default: 0 },
    deadline: { type: Date, required: true },
    status: { type: String, enum: ["in-progress", "completed"], default: "in-progress" }
}, { timestamps: true });

module.exports = mongoose.model("Goal", GoalSchema);
