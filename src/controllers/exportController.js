const { exportTransactionsToCSV, exportTransactionsToExcel } = require("../services/exportService");

exports.downloadCSV = async (req, res) => {
    try {
        const filePath = await exportTransactionsToCSV(req.user);
        res.download(filePath, "transactions.csv", (err) => {
            if (err) res.status(500).json({ msg: "Error downloading file" });
        });
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

exports.downloadExcel = async (req, res) => {
    try {
        const filePath = await exportTransactionsToExcel(req.user);
        res.download(filePath, "transactions.xlsx", (err) => {
            if (err) res.status(500).json({ msg: "Error downloading file" });
        });
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};
