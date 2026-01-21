const bcrypt = require("bcryptjs");
const validator = require("validator");
const User = require("../models/user");
const generateToken = require("../utils/generateToken");

// helper: send user data without password
const buildUserResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  skills: user.skills,
  location: user.location,
  bio: user.bio,
  createdAt: user.createdAt,
});

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, skills, location, bio } = req.body;

    // basic validations
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // allowed roles for M1
    const allowedRoles = ["volunteer", "ngo"];
    const finalRole = allowedRoles.includes(role) ? role : "volunteer";

    // check if email already exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // normalize skills to array
    let skillsArray = [];
    if (Array.isArray(skills)) {
      skillsArray = skills;
    } else if (typeof skills === "string" && skills.trim() !== "") {
      // if frontend sends "recycling, cleaning"
      skillsArray = skills.split(",").map((s) => s.trim());
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: finalRole,
      skills: skillsArray,
      location,
      bio,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message: "Registration successful",
      token,
      user: buildUserResponse(user),
    });
  } catch (err) {
    console.error("Register error:", err);

    // handle duplicate email error
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return res.status(400).json({ message: "Email already in use" });
    }

    res.status(500).json({ message: "Server error during registration" });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // basic validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (user.isSuspended) {
      return res.status(403).json({ message: "Your account is suspended. Contact admin." });
    }

    const token = generateToken(user._id);

    // remove password from response manually
    user.password = undefined;

    res.json({
      message: "Login successful",
      token,
      user: buildUserResponse(user),
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    // req.user will be populated by authMiddleware (we'll add it in next step)
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    res.json(buildUserResponse(req.user));
  } catch (err) {
    console.error("GetMe error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
// POST /api/auth/change-password
exports.changePassword = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const { currentPassword, newPassword } = req.body;

    // validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current password and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    // fetch user with password field
    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // update user password
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("changePassword error:", err);
    res.status(500).json({ message: "Server error during password change" });
  }
};