const express = require('express');
const router = express.Router();

console.log('[routes] pickupRoutes loaded');

const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');
const { getMyPickups, completePickup, createPickup, getVolunteerDashboard } = require('../controllers/pickupController');

// GET /api/pickups => my pickups (volunteer)
router.get('/', protect, allowRoles('volunteer'), getMyPickups);

// POST /api/pickups/:id/complete => mark complete (volunteer)
router.post('/:id/complete', protect, allowRoles('volunteer'), completePickup);

// POST /api/pickups => create pickup (admin/ngo)
router.post('/', protect, allowRoles('admin', 'ngo'), createPickup);

// GET /api/pickups/dashboard => volunteer dashboard data
router.get('/dashboard/summary', protect, allowRoles('volunteer'), getVolunteerDashboard);

module.exports = router;