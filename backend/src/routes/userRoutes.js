const express = require("express");
const router = express.Router();

const { getMyProfile, updateMyProfile, getUserById } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// GET /api/users/me  → get own profile
router.get("/me", protect, getMyProfile);

// PUT /api/users/me  → update own profile
router.put("/me", protect, updateMyProfile);

// GET /api/users/:userId  → get any user's public profile
router.get("/:userId", protect, getUserById);

module.exports = router;
