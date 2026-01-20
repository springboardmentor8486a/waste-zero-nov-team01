const Opportunity = require("../models/Opportunity");

// @desc    Create opportunity (NGO only)
// @route   POST /api/opportunities
exports.createOpportunity = async (req, res, next) => {
  try {
    const { title, description, required_skills, duration, date, location, status } =
      req.body;

    console.log('Creating opportunity with:', { title, description, required_skills, duration, date, location, status });

    if (!title || !description || !duration || !date || !location) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Ensure date is a valid Date object
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const opportunity = await Opportunity.create({
      title,
      description,
      required_skills,
      duration,
      date: parsedDate,
      location,
      status,
      ngo_id: req.user._id, // from JWT
    });

    console.log('Opportunity created:', opportunity);
    res.status(201).json(opportunity);
  } catch (err) {
    console.error('Create opportunity error:', err);
    next(err);
  }
};

// @desc    Get all opportunities (public)
// @route   GET /api/opportunities
exports.getAllOpportunities = async (req, res, next) => {
  try {
    const { location, status, skills } = req.query;
    const filter = {};

    if (location) filter.location = location;
    if (status) filter.status = status;
    if (skills)
      filter.required_skills = { $in: skills.split(",") };

    const opportunities = await Opportunity.find(filter).populate(
      "ngo_id",
      "_id name location"
    );

    res.json(opportunities);
  } catch (err) {
    next(err);
  }
};

// @desc    Get single opportunity
// @route   GET /api/opportunities/:id
exports.getOpportunityById = async (req, res, next) => {
  try {
    const opp = await Opportunity.findById(req.params.id).populate(
      "ngo_id",
      "_id name location"
    ).populate('participants.user', '_id name');

    if (!opp)
      return res.status(404).json({ message: "Opportunity not found" });

    res.json(opp);
  } catch (err) {
    res.status(400).json({ message: "Invalid ID" });
  }
};

// @desc    Volunteer joins an opportunity
// @route   POST /api/opportunities/:id/join
exports.joinOpportunity = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const opp = await Opportunity.findById(req.params.id);
    if (!opp) return res.status(404).json({ message: 'Opportunity not found' });

    // Check if already joined
    const already = (opp.participants || []).some(p => String(p.user) === String(userId));
    if (already) return res.status(400).json({ message: 'Already joined' });

    opp.participants = opp.participants || [];
    opp.participants.push({ user: userId, joinedAt: new Date() });
    await opp.save();

    // return minimal info to frontend
    res.status(200).json({ message: 'Joined opportunity', participantsCount: opp.participants.length });
  } catch (err) {
    console.error('joinOpportunity error:', err);
    next(err);
  }
};

// @desc    Volunteer leaves an opportunity (remove join)
// @route   DELETE /api/opportunities/:id/join
exports.leaveOpportunity = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const opp = await Opportunity.findById(req.params.id);
    if (!opp) return res.status(404).json({ message: 'Opportunity not found' });

    const before = opp.participants ? opp.participants.length : 0;
    opp.participants = (opp.participants || []).filter(p => String(p.user) !== String(userId));
    const after = opp.participants.length;
    if (before === after) return res.status(400).json({ message: 'You have not joined this opportunity' });

    await opp.save();
    res.status(200).json({ message: 'Left opportunity', participantsCount: opp.participants.length });
  } catch (err) {
    console.error('leaveOpportunity error:', err);
    next(err);
  }
};

// @desc    Update opportunity (owner NGO)
// @route   PUT /api/opportunities/:id
exports.updateOpportunity = async (req, res, next) => {
  try {
    const opp = await Opportunity.findById(req.params.id);

    if (!opp)
      return res.status(404).json({ message: "Opportunity not found" });

    if (opp.ngo_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not owner of this opportunity" });
    }

    const allowedFields = [
      "title",
      "description",
      "required_skills",
      "duration",
      "date",
      "location",
      "status",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        // Special handling for date field
        if (field === "date") {
          const parsedDate = new Date(req.body[field]);
          if (!isNaN(parsedDate.getTime())) {
            opp[field] = parsedDate;
          }
        } else {
          opp[field] = req.body[field];
        }
      }
    });

    const updated = await opp.save();
    res.json(updated);
  } catch (err) {
    console.error('Update opportunity error:', err);
    res.status(400).json({ message: "Invalid ID" });
  }
};

// @desc    Delete opportunity (owner NGO)
// @route   DELETE /api/opportunities/:id
exports.deleteOpportunity = async (req, res, next) => {
  try {
    const opp = await Opportunity.findById(req.params.id);

    if (!opp)
      return res.status(404).json({ message: "Opportunity not found" });

    if (opp.ngo_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not owner of this opportunity" });
    }

    await opp.deleteOne();
    res.json({ message: "Opportunity deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: "Invalid ID" });
  }
};
