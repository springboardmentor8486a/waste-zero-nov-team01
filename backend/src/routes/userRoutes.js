const express = require("express");
const router = express.Router();

const { getMyProfile, updateMyProfile } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// GET /api/users/me  → get own profile
router.get("/me", protect, getMyProfile);

// PUT /api/users/me  → update own profile
router.put("/me", protect, updateMyProfile);

module.exports = router;
