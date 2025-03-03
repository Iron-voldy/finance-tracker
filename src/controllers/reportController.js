const { getMonthlySpending } = require("../services/reportService");

// ✅ Get Monthly Spending Report
exports.getMonthlySpendingReport = async (req, res) => {
    try {
        const report = await getMonthlySpending(req.user);
        res.json(report);
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};
