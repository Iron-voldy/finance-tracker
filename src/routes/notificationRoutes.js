const express = require("express");
const { getUserNotifications, markNotificationAsRead, deleteNotification } = require("../controllers/notificationController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", protect, getUserNotifications);
router.put("/:id/read", protect, markNotificationAsRead);
router.delete("/:id", protect, deleteNotification);

module.exports = router;
