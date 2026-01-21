const Pickup = require('../models/Pickup');
const Opportunity = require('../models/Opportunity');

// GET /api/pickups  (volunteer)
exports.getMyPickups = async (req, res) => {
  try {
    const userId = req.user._id;
    const pickups = await Pickup.find({ volunteer: userId }).sort({ dateTime: 1 }).limit(50);
    res.json(pickups);
  } catch (err) {
    console.error('getMyPickups error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/pickups/:id/complete  (volunteer)
exports.completePickup = async (req, res) => {
  try {
    const pickupId = req.params.id;
    const userId = req.user._id;

    const pickup = await Pickup.findById(pickupId);
    if (!pickup) return res.status(404).json({ message: 'Pickup not found' });

    if (String(pickup.volunteer) !== String(userId)) {
      return res.status(403).json({ message: 'Not your pickup' });
    }

    // Accept materials and photos in body
    const { materials = {}, photos = [], notes = '' } = req.body;

    pickup.status = 'completed';
    pickup.materials = { ...pickup.materials, ...materials };
    pickup.photos = photos;
    pickup.notes = notes;
    pickup.completedAt = new Date();

    await pickup.save();

    // Optionally emit socket event
    try {
      const io = req.app.get('io');
      if (io) io.emit('pickupCompleted', { pickupId, volunteer: userId });
    } catch (e) {
      // ignore socket errors
    }

    res.json({ message: 'Pickup marked completed', pickup });
  } catch (err) {
    console.error('completePickup error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin/NGO can create pickups or assign
exports.createPickup = async (req, res) => {
  try {
    const { volunteer, dateTime, address, lat, lng, notes } = req.body;
    if (!volunteer || !dateTime || !address) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const pickup = await Pickup.create({ volunteer, dateTime, address, lat, lng, notes });
    res.status(201).json(pickup);
  } catch (err) {
    console.error('createPickup error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/dashboard  (volunteer) -- in this controller for convenience
exports.getVolunteerDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalCompleted = await Pickup.countDocuments({ volunteer: userId, status: 'completed' });

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - (now.getDay() || 7) + 1); // Monday
    startOfWeek.setHours(0,0,0,0);

    const weekCount = await Pickup.countDocuments({ volunteer: userId, dateTime: { $gte: startOfWeek }, status: { $in: ['scheduled','in_progress','completed'] } });

    const todayStart = new Date();
    todayStart.setHours(0,0,0,0);
    const todayEnd = new Date();
    todayEnd.setHours(23,59,59,999);

    const todayCount = await Pickup.countDocuments({ volunteer: userId, dateTime: { $gte: todayStart, $lte: todayEnd } });

    // total collected kg from completed pickups
    const completedPickups = await Pickup.find({ volunteer: userId, status: 'completed' });
    const collectedKg = completedPickups.reduce((acc, p) => acc + (p.materials?.totalKg || 0), 0);

    // upcoming pickups (next 10 scheduled or in_progress)
    const upcoming = await Pickup.find({ volunteer: userId, status: { $in: ['scheduled','in_progress'] } }).sort({ dateTime: 1 }).limit(10);

    // suggest top open opportunities (limit 5)
    const opportunities = await Opportunity.find({ status: 'open' }).limit(5).select('title date location');

    res.json({ stats: { totalCompleted, weekCount, todayCount, collectedKg }, upcoming, opportunities });
  } catch (err) {
    console.error('getVolunteerDashboard error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};