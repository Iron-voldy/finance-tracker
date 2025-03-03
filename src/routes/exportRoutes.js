const express = require("express");
const { downloadCSV, downloadExcel } = require("../controllers/exportController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/csv", protect, downloadCSV);
router.get("/excel", protect, downloadExcel);

module.exports = router;
