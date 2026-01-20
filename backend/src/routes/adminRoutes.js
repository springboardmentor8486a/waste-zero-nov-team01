const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const {
  getOverview,
  getAllUsers,
  updateUserStatus,
  getAllOpportunitiesAdmin,
  deleteOpportunityAdmin,
  getReports,
  downloadReport,
  getAdminLogs,
} = require("../controllers/adminController");

// overview
router.get("/overview", protect, adminOnly, getOverview);

// users
router.get("/users", protect, adminOnly, getAllUsers);
router.patch("/users/:id/status", protect, adminOnly, updateUserStatus);

// opportunities
router.get("/opportunities", protect, adminOnly, getAllOpportunitiesAdmin);
router.delete("/opportunities/:id", protect, adminOnly, deleteOpportunityAdmin);

// reports
router.get("/reports", protect, adminOnly, getReports);
router.get("/reports/download", protect, adminOnly, downloadReport);

// logs
router.get("/logs", protect, adminOnly, getAdminLogs);

module.exports = router;
