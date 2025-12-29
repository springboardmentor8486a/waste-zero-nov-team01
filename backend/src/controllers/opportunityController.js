const Opportunity = require("../models/Opportunity");

// @desc    Create opportunity (NGO only)
// @route   POST /api/opportunities
exports.createOpportunity = async (req, res, next) => {
  try {
    const { title, description, required_skills, date, duration, location, status } =
      req.body;

    if (!title || !description || !duration || !location) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const opportunity = await Opportunity.create({
      title,
      description,
      required_skills,
      date,
      duration,
      location,
      status,
      
      ngo_id: req.user._id, // from JWT
    });

    res.status(201).json(opportunity);
  } catch (err) {
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
      "name location"
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
      "name location"
    );

    if (!opp)
      return res.status(404).json({ message: "Opportunity not found" });

    res.json(opp);
  } catch (err) {
    res.status(400).json({ message: "Invalid ID" });
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
      "date",
      "duration",
      "location",
      "status",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        opp[field] = req.body[field];
      }
    });

    const updated = await opp.save();
    res.json(updated);
  } catch (err) {
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
