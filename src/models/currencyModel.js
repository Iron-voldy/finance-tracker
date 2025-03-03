const mongoose = require("mongoose");

const CurrencySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    preferredCurrency: { type: String, required: true, default: "USD" }
});

module.exports = mongoose.model("Currency", CurrencySchema);
