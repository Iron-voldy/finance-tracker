const Category = require("../models/categoryModel");

// ✅ Create a Category
exports.createCategory = async (req, res) => {
    try {
        const { name, type } = req.body;

        // Check if category already exists for the user
        const existingCategory = await Category.findOne({ user: req.user, name });
        if (existingCategory) {
            return res.status(400).json({ msg: "Category already exists" });
        }

        const category = new Category({ user: req.user, name, type });
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

// ✅ Get All Categories for a User
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ user: req.user }).sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

// ✅ Update a Category
exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category || category.user.toString() !== req.user) {
            return res.status(404).json({ msg: "Category not found" });
        }

        category.name = req.body.name || category.name;
        await category.save();
        res.json({ msg: "Category updated successfully", category });
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

// ✅ Delete a Category
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category || category.user.toString() !== req.user) {
            return res.status(404).json({ msg: "Category not found" });
        }

        await category.deleteOne();
        res.json({ msg: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};
