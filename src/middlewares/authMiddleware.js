const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

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
            const user = await User.findById(decoded.id).select("-password");

            if (!user) {
                return res.status(401).json({ msg: "User not found" });
            }

            req.user = user;
            next();
        } catch (err) {
            res.status(401).json({ msg: "Token is not valid" });
        }
    } catch (err) {
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
