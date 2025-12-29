const express = require("express");
const router = express.Router();

const {
  createOpportunity,
  getAllOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
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

module.exports = router;
