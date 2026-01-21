const jwt = require("jsonwebtoken");

const socketHandler = (io) => {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error("No authentication token provided"));
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (error) {
      console.error("Socket auth error:", error.message);
      next(new Error(`Authentication failed: ${error.message}`));
    }
  });

  io.on("connection", (socket) => {
    if (!socket.userId) {
      console.error("Socket connected without userId");
      socket.disconnect(true);
      return;
    }
    
    socket.join(socket.userId.toString());
    console.log("User connected:", socket.userId, "ID:", socket.id);

    // allow legacy/client-side explicit join
    socket.on('join_chat', (userId) => {
      if (userId) socket.join(String(userId));
    });

    // optimistic broadcast from client after server save
    socket.on('outgoingMessage', (msg) => {
      try {
        if (msg && msg.receiver_id) {
          io.to(String(msg.receiver_id)).emit('newMessage', msg);
        }
      } catch (e) {
        console.error('outgoingMessage error', e);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.userId, "ID:", socket.id);
    });

    socket.on("error", (error) => {
      console.error("Socket error for user", socket.userId, ":", error);
    });
  });
};

module.exports = socketHandler;
