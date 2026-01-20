const express = require("express");
const router = express.Router();

const {
  createOpportunity,
  getAllOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
  joinOpportunity,
} = require("../controllers/opportunityController");

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

// Public / Auth read
router.get("/", getAllOpportunities);
router.get("/:id", getOpportunityById);

// NGO only create
router.post("/", protect, allowRoles("ngo"), createOpportunity);

// NGO owner update & delete
router.put("/:id", protect, allowRoles("ngo"), updateOpportunity);
router.delete("/:id", protect, allowRoles("ngo"), deleteOpportunity);

// Volunteer joins an opportunity
router.post('/:id/join', protect, allowRoles('volunteer'), joinOpportunity);

// Volunteer leaves an opportunity
router.delete('/:id/join', protect, allowRoles('volunteer'), require('../controllers/opportunityController').leaveOpportunity);

module.exports = router;
