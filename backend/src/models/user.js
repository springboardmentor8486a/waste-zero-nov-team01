const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,                // no two users with same email
      lowercase: true,
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email address",
      },
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,               // don't return password by default in queries
    },

    role: {
      type: String,
      enum: ["volunteer", "ngo", "admin"],
      default: "volunteer",
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    location: {
      type: String,
      trim: true,
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    // extra safety flag for later (admin can suspend user)
    isSuspended: {
      type: Boolean,
      default: false,
    },
    // Wishlist of opportunity ids user is interested in
    wishlist: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity' }
    ],
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
  }
);

// indexes (for performance and uniqueness)
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });

const User = mongoose.model("User", userSchema);

module.exports = User;
