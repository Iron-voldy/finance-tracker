const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db"); 
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const reportRoutes = require("./routes/reportRoutes");
const currencyRoutes = require("./routes/currencyRoutes");
const goalRoutes = require("./routes/goalRoutes");
const trendRoutes = require("./routes/trendRoutes");
const exportRoutes = require("./routes/exportRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Add this right after connectDB() in server.js
const dropLegacyIndex = async () => {
    try {
      // Get the Categories model
      const Category = require('./models/categoryModel');
      
      // Access the MongoDB collection directly
      const collection = Category.collection;
      
      // Get all indexes on the collection
      const indexes = await collection.indexes();
      
      // Check if the name_1 index exists
      const nameIndex = indexes.find(index => 
        index.name === 'name_1' && index.unique === true
      );
      
      if (nameIndex) {
        console.log('Found legacy unique index on name field, dropping it...');
        await collection.dropIndex('name_1');
        console.log('Legacy index dropped successfully');
      }
    } catch (error) {
      console.error('Error handling legacy index:', error);
    }
  };
  
  // Call the function
  dropLegacyIndex();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/currency", currencyRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/trends", trendRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
