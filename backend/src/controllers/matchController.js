const Opportunity = require("../models/Opportunity");
const User = require("../models/User");

// helper: skill overlap count
const overlapScore = (a = [], b = []) => {
  if (!a || !b) return 0;
  const setB = new Set(b.map(s => s.toLowerCase().trim()));
  return a.filter(s => setB.has(s.toLowerCase().trim())).length;
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

    console.log(`\n=== Finding matches for opportunity: ${opp._id} ===`);
    console.log(`Opportunity:`, {
      title: opp.title,
      location: opp.location,
      required_skills: opp.required_skills
    });

    const volunteers = await User.find({ role: "volunteer" });
    console.log(`Total volunteers found: ${volunteers.length}`);

    const matched = volunteers
      .map((v) => {
        const skillScore = overlapScore(
          opp.required_skills,
          v.skills || []
        );
        const sameLocation =
          opp.location.toLowerCase() ===
          (v.location || "").toLowerCase();
        const totalScore = skillScore + (sameLocation ? 1 : 0);

        console.log(`Volunteer: ${v.name}`);
        console.log(`  - Location: ${v.location} (match: ${sameLocation})`);
        console.log(`  - Skills: ${(v.skills || []).join(', ')}`);
        console.log(`  - Skill score: ${skillScore}, Location score: ${sameLocation ? 1 : 0}, Total: ${totalScore}`);

        return {
          volunteer: {
            _id: v._id,
            name: v.name,
            skills: v.skills,
            location: v.location,
          },
          score: totalScore,
        };
      })
      .filter((m) => m.score >= 0)  // Show all volunteers, even with score 0
      .sort((a, b) => b.score - a.score);

    console.log(`\nMatches found: ${matched.length}`);
    console.log(`Matched volunteers:`, matched);
    console.log(`=== End of matching ===\n`);

    res.json(matched);
  } catch (err) {
    console.error('Error in getMatchesForOpportunity:', err);
    next(err);
  }
};
