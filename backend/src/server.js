// // backend/src/server.js
// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const helmet = require("helmet");
// const rateLimit = require("express-rate-limit");
// const connectDB = require("./config/db");
// const opportunityRoutes = require("./routes/opportunityRoutes");
// const errorHandler = require("./middleware/errorMiddleware");
// const authRoutes = require("./routes/authRoutes");
// const userRoutes = require("./routes/userRoutes");
// const messagesRoutes = require("./routes/messages");


// // connect to database
// connectDB();

// const app = express();

// // basic security middlewares
// app.use(helmet());

// // CORS – FRONTEND PORT EKKADA RUN AVUTUNDO DANE IKKADA PETTU
// app.use(
//   cors({
//     origin: true, // or 5126 unte "http://localhost:5126"
//     credentials: true,
//   })
// );

// app.use(express.json());

// // rate limiter
// app.use(
//   rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 100,
//   })
// );

// // API routes
// app.use("/api/opportunities", opportunityRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/messages", messagesRoutes);

// // error handler
// app.use(errorHandler);

// // start server – ONLY here
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });







require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const opportunityRoutes = require("./routes/opportunityRoutes");
const errorHandler = require("./middleware/errorMiddleware");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const messagesRoutes = require("./routes/messages");

// connect to database
connectDB();

const app = express();

// security
app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

// routes
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messagesRoutes);

app.use(errorHandler);

// 🔑 CREATE HTTP SERVER
const server = http.createServer(app);

// 🔑 SOCKET.IO SERVER
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// 🔥 SOCKET EVENTS
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  socket.on("registerUser", ({ userId }) => {
    socket.join(userId);
    console.log("User registered to room:", userId);
  });

  socket.on("sendMessage", (msg) => {
    io.to(msg.to).emit("newMessage", msg);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

// 🚀 START SERVER
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
