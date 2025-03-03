const express = require("express");
const { getAdminDashboard, getUserDashboard } = require("../controllers/dashboardController");
const { protect, admin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/admin", protect, admin, getAdminDashboard);
router.get("/user", protect, getUserDashboard);

module.exports = router;
