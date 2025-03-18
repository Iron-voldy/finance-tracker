const Category = require("../models/categoryModel");

exports.createCategory = async (req, res) => {
    try {
        const { name, type } = req.body;

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

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ user: req.user }).sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findOne({ 
            _id: req.params.id,
            user: req.user
        });
        
        if (!category) {
            return res.status(404).json({ msg: "Category not found" });
        }

        category.name = req.body.name || category.name;
        await category.save();
        
        res.status(200).json({ 
            msg: "Category updated successfully", 
            category 
        });
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findOne({ 
            _id: req.params.id,
            user: req.user
        });
        
        if (!category) {
            return res.status(404).json({ msg: "Category not found" });
        }

        await category.deleteOne();
        res.status(200).json({ msg: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};