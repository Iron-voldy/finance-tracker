const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");

dotenv.config();
const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);

module.exports = app;
