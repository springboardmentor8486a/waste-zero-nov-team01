const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  console.log("Connecting to Mongo...", uri);
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;