const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true }, // Remove the unique: true constraint here
    type: { type: String, enum: ["income", "expense"], required: true } 
}, { timestamps: true });

// Create a compound index for user and name to ensure uniqueness per user
CategorySchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Category", CategorySchema);