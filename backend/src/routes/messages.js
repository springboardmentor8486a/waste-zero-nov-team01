// routes/messages.js
const express = require("express");
const router = express.Router();


// Example: use your DB client here
const db = require("../config/db"); // adjust as per project

// GET /api/messages/:userId/:otherId
router.get("/:userId/:otherId", async (req, res) => {
  const { userId, otherId } = req.params;

  try {
    const rows = await db.query(
      `
      SELECT id, sender_id, receiver_id, content, timestamp
      FROM Messages
      WHERE (sender_id = ? AND receiver_id = ?)
         OR (sender_id = ? AND receiver_id = ?)
      ORDER BY timestamp ASC
      `,
      [userId, otherId, otherId, userId]
    );

    res.json(rows);
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
    const now = new Date();

    const result = await db.query(
      `
      INSERT INTO Messages (sender_id, receiver_id, content, timestamp)
      VALUES (?, ?, ?, ?)
      `,
      [sender_id, receiver_id, content, now]
    );

    res.status(201).json({
      id: result.insertId,
      sender_id,
      receiver_id,
      content,
      timestamp: now,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send message" });
  }
});

module.exports = router;