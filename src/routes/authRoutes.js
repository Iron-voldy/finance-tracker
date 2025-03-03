const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const { check } = require("express-validator");

const router = express.Router();

router.post("/register", [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Valid email required").isEmail(),
    check("password", "Password should be 6+ characters").isLength({ min: 6 })
], registerUser);

router.post("/login", loginUser);

module.exports = router;
