const Transaction = require("../models/transactionModel");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const ExcelJS = require("exceljs");
const fs = require("fs");

exports.exportTransactionsToCSV = async (user) => {
    const transactions = await Transaction.find({ user: user._id }).populate("category", "name type");

    const filePath = `exports/transactions_${user._id}.csv`;
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
        _id: txn._id,
        type: txn.type,
        amount: txn.amount,
        category: txn.category.name,
        description: txn.description,
        date: txn.date.toISOString()
    }));

    await csvWriter.writeRecords(data);
    return filePath;
};

exports.exportTransactionsToExcel = async (user) => {
    const transactions = await Transaction.find({ user: user._id }).populate("category", "name type");

    const filePath = `exports/transactions_${user._id}.xlsx`;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Transactions");

    worksheet.columns = [
        { header: "Transaction ID", key: "_id", width: 30 },
        { header: "Type", key: "type", width: 15 },
        { header: "Amount", key: "amount", width: 15 },
        { header: "Category", key: "category", width: 20 },
        { header: "Description", key: "description", width: 30 },
        { header: "Date", key: "date", width: 20 }
    ];

    transactions.forEach(txn => {
        worksheet.addRow({
            _id: txn._id,
            type: txn.type,
            amount: txn.amount,
            category: txn.category.name,
            description: txn.description,
            date: txn.date.toISOString()
        });
    });

    await workbook.xlsx.writeFile(filePath);
    return filePath;
};
