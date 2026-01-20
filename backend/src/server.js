require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const createAdminIfNotExists = require("./config/createAdmin");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const opportunityRoutes = require("./routes/opportunityRoutes");
const matchRoutes = require("./routes/matchRoutes");          // ⭐ M3
const messageRoutes = require("./routes/messageRoutes");      // ⭐ M3
const pickupRoutes = require("./routes/pickupRoutes");
const adminRoutes = require("./routes/adminRoutes");

const errorHandler = require("./middleware/errorMiddleware");
const socketHandler = require("./sockets/sockets");            // ⭐ M3

// connect to database
// connectDB();

const app = express();

connectDB();
createAdminIfNotExists();


// basic security middlewares
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP
  })
);

// enable CORS for frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

// parse JSON body
app.use(express.json());

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/matches", matchRoutes);      // ⭐ Milestone 3
app.use("/api/pickups", pickupRoutes);
app.use("/api/messages", messageRoutes);   // ⭐ Milestone 3
app.use("/api/admin", adminRoutes);

// simple health check route
app.get("/", (req, res) => {
  res.json({ message: "WasteZero backend is running." });
});

// DEBUG: list basic registered routes (useful during development)
app.get('/api/debug/routes', (req, res) => {
  try {
    const routeList = [];
    app._router.stack.forEach((middleware) => {
      if (middleware.route) {
        // routes registered directly on the app
        routeList.push({ path: middleware.route.path, methods: Object.keys(middleware.route.methods) });
      } else if (middleware.name === 'router' && middleware.handle && middleware.handle.stack) {
        // router middleware
        middleware.handle.stack.forEach((handler) => {
          if (handler.route) {
            routeList.push({ path: handler.route.path, methods: Object.keys(handler.route.methods) });
          }
        });
      }
    });
    res.json({ routes: routeList });
  } catch (e) {
    res.status(500).json({ message: 'Unable to list routes', error: e.message });
  }
});

// error handler (after all routes)
app.use(errorHandler);

// ================ SOCKET SETUP =================
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

// make io accessible in controllers
app.set("io", io);

// initialize socket handlers
socketHandler(io);

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`  # Server running on port ${PORT}`);
});
