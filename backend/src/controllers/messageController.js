const Message = require("../models/Message");

// @route POST /api/messages
exports.sendMessage = async (req, res, next) => {
  try {
    const { receiver_id, content } = req.body;

    if (!receiver_id || !content) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const msg = await Message.create({
      sender_id: req.user._id,
      receiver_id,
      content,
    });

    // emit via socket if available
    const io = req.app.get("io");
    if (io) {
      io.to(receiver_id.toString()).emit("newMessage", msg);
    }

    res.status(201).json(msg);
  } catch (err) {
    console.error("sendMessage error:", err.message);
    next(err);
  }
};
//@route GET /api/messages/conversations
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const messages = await Message.find({
      $or: [{ sender_id: userId }, { receiver_id: userId }]
    })
      .populate("sender_id", "name _id")
      .populate("receiver_id", "name _id")
      .sort({ timestamp: -1 })
      .lean();
    
    if (!messages || messages.length === 0) {
      return res.json([]);
    }
    
    // Group messages into conversations (latest message per user)
    const conversationMap = {};
    messages.forEach((msg) => {
      if (!msg.sender_id || !msg.receiver_id) return;
      
      const senderId = String(msg.sender_id._id);
      const receiverId = String(msg.receiver_id._id);
      const otherUserId = senderId === String(userId) ? receiverId : senderId;
      
      if (!conversationMap[otherUserId]) {
        conversationMap[otherUserId] = msg;
      }
    });
    
    const conversations = Object.values(conversationMap).map((msg) => {
      const senderId = String(msg.sender_id._id);
      const otherUser = senderId === String(userId) ? msg.receiver_id : msg.sender_id;
      return {
        otherUserId: otherUser._id,
        otherUserName: otherUser.name || "User",
        lastMessage: {
          text: msg.content,
          timestamp: msg.timestamp
        }
      };
    });
    
    res.json(conversations);
  } catch (error) {
    console.error("getConversations error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// @route GET /api/messages/:userId
exports.getMessageHistory = async (req, res, next) => {
  try {
    const otherUserId = req.params.userId;
    
    if (!otherUserId || otherUserId === "undefined") {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const msgs = await Message.find({
      $or: [
        { sender_id: req.user._id, receiver_id: otherUserId },
        { sender_id: otherUserId, receiver_id: req.user._id },
      ],
    }).sort({ timestamp: 1 });

    res.json(msgs);
  } catch (err) {
    console.error("getMessageHistory error:", err.message);
    next(err);
  }
};
