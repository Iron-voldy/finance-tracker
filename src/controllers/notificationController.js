const Notification = require("../models/notificationModel");

exports.getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

exports.markNotificationAsRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { read: true });
        res.json({ msg: "Notification marked as read" });
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

exports.deleteNotification = async (req, res) => {
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.json({ msg: "Notification deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};
