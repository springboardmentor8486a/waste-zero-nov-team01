const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  sendMessage,
  getMessageHistory,
} = require("../controllers/messageController");

router.post("/", protect, sendMessage);
router.get("/:userId", protect, getMessageHistory);

module.exports = router;
