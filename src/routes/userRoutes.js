const express = require("express");
const { getUserProfile, updateUserProfile, deleteUserProfile } = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/me", protect, getUserProfile);      
router.put("/update", protect, updateUserProfile); 
router.delete("/delete", protect, deleteUserProfile); 

module.exports = router;
