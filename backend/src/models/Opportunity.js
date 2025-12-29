const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    required_skills: [
      {
        type: String,
        trim: true,
      },
    ],
    duration: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "closed", "in-progress"],
      default: "open",
    },
    
    ngo_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Indexes
opportunitySchema.index({ ngo_id: 1 });
opportunitySchema.index({ location: 1 });
opportunitySchema.index({ status: 1 });

module.exports = mongoose.model("Opportunity", opportunitySchema);
