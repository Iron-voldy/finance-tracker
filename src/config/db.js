const mongoose = require("mongoose");

console.log("MongoDB URI:", process.env.MONGO_URI);

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("❌ MONGO_URI is not defined. Check your .env file.");
        }
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected...");
    } catch (error) {
        console.error("❌ MongoDB Connection Failed:", error);
        process.exit(1);
    }
};

module.exports = connectDB;
