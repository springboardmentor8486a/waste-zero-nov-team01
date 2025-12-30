const Opportunity = require("../models/Opportunity");
const User = require("../models/User");

// helper: skill overlap count
const overlapScore = (a = [], b = []) => {
  const setB = new Set(b.map(s => s.toLowerCase()));
  return a.filter(s => setB.has(s.toLowerCase())).length;
};

// @route GET /api/matches (Volunteer)
exports.getMatchesForVolunteer = async (req, res, next) => {
  try {
    const volunteer = req.user;

    const opps = await Opportunity.find({ status: "open" }).populate(
      "ngo_id",
      "name location"
    );

    const matches = opps
      .map((opp) => {
        const score = overlapScore(
          opp.required_skills,
          volunteer.skills || []
        );
        const sameLocation =
          opp.location.toLowerCase() ===
          (volunteer.location || "").toLowerCase();

        return {
          opportunity: opp,
          score: sameLocation ? score + 1 : score,
        };
      })
      .filter((m) => m.score > 0)
      .sort((a, b) => b.score - a.score);

    res.json(matches);
  } catch (err) {
    next(err);
  }
};

// @route GET /api/matches/:opportunityId (NGO)
exports.getMatchesForOpportunity = async (req, res, next) => {
  try {
    const opp = await Opportunity.findById(req.params.opportunityId);

    if (!opp)
      return res.status(404).json({ message: "Opportunity not found" });

    if (opp.ngo_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not owner of this opportunity" });
    }

    const volunteers = await User.find({ role: "volunteer" });

    const matched = volunteers
      .map((v) => {
        const score = overlapScore(
          opp.required_skills,
          v.skills || []
        );
        const sameLocation =
          opp.location.toLowerCase() ===
          (v.location || "").toLowerCase();

        return {
          volunteer: {
            _id: v._id,
            name: v.name,
            skills: v.skills,
            location: v.location,
          },
          score: sameLocation ? score + 1 : score,
        };
      })
      .filter((m) => m.score > 0)
      .sort((a, b) => b.score - a.score);

    res.json(matched);
  } catch (err) {
    next(err);
  }
};
