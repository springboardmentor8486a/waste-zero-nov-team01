require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");



// connect to database
connectDB();

const app = express();

// basic security middlewares
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP
  })
);

// enable CORS for frontend (for now allow all)
app.use(cors());

// parse JSON body
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);



// simple health check route
app.get("/", (req, res) => {
  res.json({ message: "WasteZero backend is running." });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`   Server running on port ${PORT}`);
});
