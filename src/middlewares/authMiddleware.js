const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const mongoose = require("mongoose");

exports.protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ msg: "No token, authorization denied" });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Get full user object from database
            const user = await User.findById(decoded.id).select("-password");
            
            if (!user) {
                return res.status(401).json({ msg: "User not found" });
            }
            
            // Set the full user object on the request
            req.user = user;
            
            // Log for debugging
            console.log("User in middleware:", {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email
            });
            
            next();
        } catch (err) {
            console.error("Token verification failed:", err.message);
            res.status(401).json({ msg: "Token is not valid" });
        }
    } catch (err) {
        console.error("Auth middleware error:", err.message);
        res.status(500).json({ msg: "Server Error" });
    }
};

exports.admin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ msg: "Access denied. Admin only." });
    }
};