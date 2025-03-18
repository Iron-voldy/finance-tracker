const Transaction = require("../models/transactionModel");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const ExcelJS = require("exceljs");
const fs = require("fs");

exports.exportTransactionsToCSV = async (user) => {
    try {
        // Create directory if it doesn't exist
        const dir = 'exports';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Convert string user ID to MongoDB ObjectId if needed
        const userId = typeof user === 'string' ? user : user._id.toString();
        
        const transactions = await Transaction.find({ user: userId })
            .populate("category", "name type")
            .sort({ date: -1 });

        const filePath = `exports/transactions_${userId}.csv`;
        const csvWriter = createCsvWriter({
            path: filePath,
            header: [
                { id: "_id", title: "Transaction ID" },
                { id: "type", title: "Type" },
                { id: "amount", title: "Amount" },
                { id: "category", title: "Category" },
                { id: "description", title: "Description" },
                { id: "date", title: "Date" }
            ]
        });

        const data = transactions.map(txn => ({
            _id: txn._id.toString(),
            type: txn.type,
            amount: txn.amount,
            category: txn.category ? txn.category.name : "Unknown",
            description: txn.description || "",
            date: txn.date.toISOString()
        }));

        await csvWriter.writeRecords(data);
        console.log(`CSV file created successfully: ${filePath}`);
        return filePath;
    } catch (error) {
        console.error("Error exporting to CSV:", error);
        throw error;
    }
};

exports.exportTransactionsToExcel = async (user) => {
    try {
        // Create directory if it doesn't exist
        const dir = 'exports';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Convert string user ID to MongoDB ObjectId if needed
        const userId = typeof user === 'string' ? user : user._id.toString();
        
        // Find transactions with populated category
        const transactions = await Transaction.find({ user: userId })
            .populate("category", "name type")
            .sort({ date: -1 });

        if (!transactions || transactions.length === 0) {
            console.log("No transactions found for user:", userId);
            // Create an empty file with headers only
        }

        const filePath = `exports/transactions_${userId}.xlsx`;
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Transactions");

        // Define columns
        worksheet.columns = [
            { header: "Transaction ID", key: "id", width: 30 },
            { header: "Type", key: "type", width: 15 },
            { header: "Amount", key: "amount", width: 15 },
            { header: "Category", key: "category", width: 20 },
            { header: "Description", key: "description", width: 30 },
            { header: "Date", key: "date", width: 20 }
        ];

        // Add data rows
        transactions.forEach(txn => {
            worksheet.addRow({
                id: txn._id.toString(),
                type: txn.type,
                amount: txn.amount,
                category: txn.category ? txn.category.name : "Unknown",
                description: txn.description || "",
                date: txn.date.toISOString()
            });
        });

        // Apply some formatting
        worksheet.getRow(1).font = { bold: true };
        worksheet.getColumn('amount').numFmt = '#,##0.00';

        // Save the file
        await workbook.xlsx.writeFile(filePath);
        console.log(`Excel file created successfully: ${filePath}`);
        return filePath;
    } catch (error) {
        console.error("Error exporting to Excel:", error);
        throw error;
    }
};