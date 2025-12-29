// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { register, login, changePassword, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/change-password", protect, changePassword); // important
router.get("/me", protect, getMe);

module.exports = router;