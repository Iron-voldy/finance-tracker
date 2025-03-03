const express = require("express");
const {
    createGoal,
    getGoals,
    updateGoal,
    deleteGoal,
    allocateSavingsToGoal
} = require("../controllers/goalController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", protect, createGoal);
router.get("/", protect, getGoals);
router.put("/:id", protect, updateGoal);
router.delete("/:id", protect, deleteGoal);
router.post("/:id/allocate", protect, allocateSavingsToGoal);

module.exports = router;
