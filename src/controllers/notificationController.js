const Notification = require("../models/notificationModel");

exports.getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

exports.markNotificationAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            user: req.user
        });
        
        if (!notification) {
            return res.status(404).json({ msg: "Notification not found" });
        }
        
        notification.read = true;
        await notification.save();
        
        res.status(200).json({ msg: "Notification marked as read" });
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

exports.deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            user: req.user
        });
        
        if (!notification) {
            return res.status(404).json({ msg: "Notification not found" });
        }
        
        await notification.deleteOne();
        res.status(200).json({ msg: "Notification deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};