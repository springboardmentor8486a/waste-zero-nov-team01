const mongoose = require("mongoose");

const adminLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    admin_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    target_id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    metadata: {
      type: Object,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

adminLogSchema.index({ timestamp: -1 });

module.exports = mongoose.model("AdminLog", adminLogSchema);
