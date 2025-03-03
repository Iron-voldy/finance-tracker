const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// ✅ Load environment variables BEFORE using them
dotenv.config();

// ✅ Debugging: Print to confirm if .env is loading
console.log("Loaded MONGO_URI from .env:", process.env.MONGO_URI);

// Connect to Database
connectDB();

// Initialize Express App
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
