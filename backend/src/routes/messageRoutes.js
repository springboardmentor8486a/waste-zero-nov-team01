const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  sendMessage,
  getMessageHistory,
  getConversations
} = require("../controllers/messageController");

router.post("/", protect, sendMessage);
router.get("/conversations", protect, getConversations);
router.get("/:userId", protect, getMessageHistory);

module.exports = router;
