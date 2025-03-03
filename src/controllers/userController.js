const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

// ✅ Get Logged-in User Profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user).select("-password");
        if (!user) return res.status(404).json({ msg: "User not found" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

// ✅ Update User Profile
exports.updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user);
        if (!user) return res.status(404).json({ msg: "User not found" });

        const { name, email, bio, profileImage, password } = req.body;

        if (name) user.name = name;
        if (email) user.email = email;
        if (bio) user.bio = bio;
        if (profileImage) user.profileImage = profileImage;
        if (password) user.password = await bcrypt.hash(password, 10);

        await user.save();
        res.json({ msg: "Profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

// ✅ Delete User Account
exports.deleteUserProfile = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user);
        res.json({ msg: "User account deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};
