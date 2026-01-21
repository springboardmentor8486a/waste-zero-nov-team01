const express = require("express");
const router = express.Router();

console.log('[routes] userRoutes loaded');

const { getMyProfile, updateMyProfile, getUserById, getMyWishlist, addToWishlist, removeFromWishlist } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// GET /api/users/me  → get own profile
router.get("/me", protect, getMyProfile);

// PUT /api/users/me  → update own profile
router.put("/me", protect, updateMyProfile);

// GET /api/users/:userId  → get any user's public profile
router.get("/:userId", protect, getUserById);

// Wishlist routes (volunteer)
router.get('/me/wishlist', protect, getMyWishlist);
router.post('/me/wishlist', protect, addToWishlist);
router.delete('/me/wishlist/:opportunityId', protect, removeFromWishlist);
// GET /api/users/me/joined – opportunities the user has joined
router.get('/me/joined', protect, require('../controllers/userController').getMyJoined);

module.exports = router;
