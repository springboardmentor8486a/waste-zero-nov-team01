const Message = require("../models/Message");

// @route POST /api/messages
exports.sendMessage = async (req, res, next) => {
  try {
    const { receiver_id, content } = req.body;

    if (!receiver_id || !content) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const msg = await Message.create({
      sender_id: req.user._id,
      receiver_id,
      content,
    });

    // emit via socket
    const io = req.app.get("io");
    io.to(receiver_id.toString()).emit("newMessage", msg);

    res.status(201).json(msg);
  } catch (err) {
    next(err);
  }
};

// @route GET /api/messages/:userId
exports.getMessageHistory = async (req, res, next) => {
  try {
    const otherUserId = req.params.userId;

    const msgs = await Message.find({
      $or: [
        { sender_id: req.user._id, receiver_id: otherUserId },
        { sender_id: otherUserId, receiver_id: req.user._id },
      ],
    }).sort({ timestamp: 1 });

    res.json(msgs);
  } catch (err) {
    next(err);
  }
};
