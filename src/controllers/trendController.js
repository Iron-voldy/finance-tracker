const { getExpenseTrends, getIncomeTrends, detectUnusualSpending } = require("../services/trendService");

// ✅ Get Monthly Expense Trends
exports.getExpenseTrends = async (req, res) => {
    try {
        // Log user in controller to verify it's correctly set
        console.log("User in expense trend controller:", {
            id: req.user._id,
            name: req.user.name
        });
        
        const trends = await getExpenseTrends(req.user);
        res.json(trends);
    } catch (error) {
        console.error("Error in getExpenseTrends controller:", error);
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

// ✅ Get Monthly Income Trends
exports.getIncomeTrends = async (req, res) => {
    try {
        console.log("User in income trend controller:", {
            id: req.user._id,
            name: req.user.name
        });
        
        const trends = await getIncomeTrends(req.user);
        res.json(trends);
    } catch (error) {
        console.error("Error in getIncomeTrends controller:", error);
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

// ✅ Detect Unusual Spending
exports.getUnusualSpending = async (req, res) => {
    try {
        console.log("User in unusual spending controller:", {
            id: req.user._id,
            name: req.user.name
        });
        
        const unusualSpending = await detectUnusualSpending(req.user);
        res.json(unusualSpending);
    } catch (error) {
        console.error("Error in getUnusualSpending controller:", error);
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};