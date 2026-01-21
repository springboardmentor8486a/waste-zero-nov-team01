const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");
const {
  getMatchesForVolunteer,
  getMatchesForOpportunity,
} = require("../controllers/matchController");

router.get("/", protect, allowRoles("volunteer", "ngo"), getMatchesForVolunteer);
router.get("/:opportunityId", protect, allowRoles("ngo"), getMatchesForOpportunity);

module.exports = router;