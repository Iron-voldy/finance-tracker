const axios = require("axios");
const Currency = require("../models/currencyModel");

// ✅ Get Exchange Rates from an API (e.g., Open Exchange Rates)
exports.getExchangeRates = async () => {
    try {
        const apiKey = process.env.EXCHANGE_RATE_API_KEY;
        const response = await axios.get(`https://open.er-api.com/v6/latest/USD?apikey=${apiKey}`);
        return response.data.rates;
    } catch (error) {
        console.error("❌ Error fetching exchange rates:", error.message);
        return null;
    }
};

// ✅ Convert an amount from one currency to another
exports.convertAmountToCurrency = async (amount, fromCurrency, toCurrency) => {
    const rates = await exports.getExchangeRates();
    if (!rates) return null;

    if (fromCurrency === "USD") {
        return (amount * rates[toCurrency]).toFixed(2);
    } else {
        const amountInUSD = amount / rates[fromCurrency];
        return (amountInUSD * rates[toCurrency]).toFixed(2);
    }
};
