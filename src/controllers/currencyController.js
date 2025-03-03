const Currency = require("../models/currencyModel");
const { convertAmountToCurrency, getExchangeRates } = require("../services/currencyService");

exports.updatePreferredCurrency = async (req, res) => {
    try {
        let currency = await Currency.findOne({ user: req.user });

        if (!currency) {
            currency = new Currency({ user: req.user, preferredCurrency: req.body.currency });
        } else {
            currency.preferredCurrency = req.body.currency;
        }

        await currency.save();
        res.json({ msg: "Preferred currency updated successfully", preferredCurrency: currency.preferredCurrency });
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

exports.getPreferredCurrency = async (req, res) => {
    try {
        const currency = await Currency.findOne({ user: req.user });
        if (!currency) {
            return res.json({ preferredCurrency: "USD" }); 
        }
        res.json({ preferredCurrency: currency.preferredCurrency });
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

exports.convertToPreferredCurrency = async (req, res) => {
    try {
        const { amount, fromCurrency } = req.body;
        const currency = await Currency.findOne({ user: req.user });

        if (!currency) {
            return res.status(400).json({ msg: "Preferred currency not set" });
        }

        const convertedAmount = await convertAmountToCurrency(amount, fromCurrency, currency.preferredCurrency);
        res.json({ convertedAmount, preferredCurrency: currency.preferredCurrency });
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};
