// backend/src/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const opportunityRoutes = require("./routes/opportunityRoutes");
const errorHandler = require("./middleware/errorMiddleware");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const messagesRoutes = require("./routes/messages");


// connect to database
connectDB();

const app = express();

// basic security middlewares
app.use(helmet());

// CORS – FRONTEND PORT EKKADA RUN AVUTUNDO DANE IKKADA PETTU
app.use(
  cors({
    origin: true, // or 5126 unte "http://localhost:5126"
    credentials: true,
  })
);

app.use(express.json());

// rate limiter
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

// API routes
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messagesRoutes);

// error handler
app.use(errorHandler);

// start server – ONLY here
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});