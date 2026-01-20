const User = require("../models/user");

// GET /api/users/me
// returns the currently logged-in user's profile
exports.getMyProfile = async (req, res) => {
  try {
    // req.user is already attached by protect middleware
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      skills: req.user.skills,
      location: req.user.location,
      bio: req.user.bio,
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt,
    });
  } catch (err) {
    console.error("getMyProfile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/users/me
// updates profile fields: name, skills, bio, location
exports.updateMyProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const { name, skills, bio, location } = req.body;

    const updateData = {};

    if (name) updateData.name = name;
    if (typeof bio === "string") updateData.bio = bio;
    if (typeof location === "string") updateData.location = location;

    // handle skills: can be array or comma-separated string
    if (Array.isArray(skills)) {
      updateData.skills = skills;
    } else if (typeof skills === "string" && skills.trim() !== "") {
      updateData.skills = skills.split(",").map((s) => s.trim());
    }

    // do NOT allow email or password change here in M1
    // ignore email/password if sent from frontend

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        skills: updatedUser.skills,
        location: updatedUser.location,
        bio: updatedUser.bio,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (err) {
    console.error("updateMyProfile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
// GET /api/users/:userId
// returns public profile of any user
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      skills: user.skills,
      location: user.location,
      bio: user.bio,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    console.error("getUserById error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/users/me/wishlist  -> get user's wishlist (volunteer)
exports.getMyWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist', 'title date location');
    res.json({ wishlist: user.wishlist || [] });
  } catch (err) {
    console.error('getMyWishlist error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/users/me/wishlist   -> add to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { opportunityId } = req.body;
    if (!opportunityId) return res.status(400).json({ message: 'opportunityId required' });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.wishlist) user.wishlist = [];
    if (!user.wishlist.some(id => String(id) === String(opportunityId))) {
      user.wishlist.push(opportunityId);
      await user.save();
    }

    res.status(200).json({ message: 'Added to wishlist', wishlist: user.wishlist });
  } catch (err) {
    console.error('addToWishlist error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/users/me/wishlist/:opportunityId  -> remove from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { opportunityId } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.wishlist = (user.wishlist || []).filter(id => String(id) !== String(opportunityId));
    await user.save();

    res.status(200).json({ message: 'Removed from wishlist', wishlist: user.wishlist });
  } catch (err) {
    console.error('removeFromWishlist error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/users/me/joined  -> get opportunities the user joined
exports.getMyJoined = async (req, res) => {
  try {
    const Opportunity = require('../models/Opportunity');
    const joined = await Opportunity.find({ 'participants.user': req.user._id }).populate('ngo_id', '_id name location');
    res.json({ joined });
  } catch (err) {
    console.error('getMyJoined error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};