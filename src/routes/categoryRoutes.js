const express = require("express");
const {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
} = require("../controllers/categoryController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Category routes
router.post("/", protect, createCategory);
router.get("/", protect, getCategories);
router.put("/:id", protect, updateCategory);
router.delete("/:id", protect, deleteCategory);

module.exports = router;