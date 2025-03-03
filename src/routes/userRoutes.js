const express = require("express");
const { getUserProfile, updateUserProfile, deleteUserProfile } = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/me", protect, getUserProfile);      // Get user profile
router.put("/update", protect, updateUserProfile); // Update user profile
router.delete("/delete", protect, deleteUserProfile); // Delete user account

module.exports = router;
