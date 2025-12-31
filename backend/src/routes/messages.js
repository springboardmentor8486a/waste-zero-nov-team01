// backend/src/routes/messages.js



const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// GET /api/messages/:userId/:otherId
router.get("/:userId/:otherId", async (req, res) => {
  const { userId, otherId } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender_id: userId, receiver_id: otherId },
        { sender_id: otherId, receiver_id: userId },
      ],
    }).sort({ timestamp: 1 }); // oldest first
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load messages" });
  }
});

// POST /api/messages
router.post("/", async (req, res) => {
  const { sender_id, receiver_id, content } = req.body;
  if (!sender_id || !receiver_id || !content) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const newMessage = new Message({ sender_id, receiver_id, content });
    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send message" });
  }
});

module.exports = router;
