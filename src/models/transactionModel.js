const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    amount: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }, 
    description: { type: String },
    date: { type: Date, default: Date.now },
    isRecurring: { type: Boolean, default: false },
    recurringInterval: { type: String, enum: ["daily", "weekly", "monthly", "yearly"], default: null },
}, { timestamps: true });

module.exports = mongoose.model("Transaction", TransactionSchema);
