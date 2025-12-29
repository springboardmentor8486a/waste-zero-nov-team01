// src/pages/VolunteerDashboard.jsx
import { useNavigate } from "react-router-dom";

const sampleMatches = [
  {
    id: 1,
    title: "Weekend Teaching Volunteer",
    ngoName: "Bright Minds Foundation",
    location: "Hyderabad",
    score: 92,
    tags: ["Teaching", "Community"],
  },
  {
    id: 2,
    title: "Lake Cleanup Drive",
    ngoName: "Green Earth",
    location: "Secunderabad",
    score: 88,
    tags: ["Cleaning", "Environment"],
  },
];

const VolunteerDashboard = ({ matches = [] }) => {
  const navigate = useNavigate();

  const matchesToShow =
    matches && matches.length > 0 ? matches : sampleMatches;

  return (
    <div className="min-h-screen px-8 py-8 bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-50">
          Volunteer Dashboard
        </h1>
        <button
          onClick={() => navigate("/matches")}
          className="px-4 py-2 rounded-full bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
        >
          View all matches
        </button>
      </div>

      {/* Recommended Opportunities */}
      <section className="max-w-4xl">
        <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-slate-50">
          Recommended Opportunities
        </h2>
        {matchesToShow.length === 0 ? (
          <p className="text-sm text-gray-500">
            No matches yet. Update your skills to get recommendations.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matchesToShow.map((m) => (
              <div
                key={m.id}
                className="rounded-xl border border-gray-200 bg-white shadow-sm px-4 py-4"
              >
                <p className="text-[11px] font-semibold text-emerald-600 mb-1">
                  Match found · {m.score}% match
                </p>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  {m.title}
                </h3>
                <p className="text-xs text-gray-500 mb-2">
                  {m.ngoName} • {m.location}
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {m.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  className="px-3 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-medium hover:bg-emerald-600"
                  onClick={() => navigate(`/opportunities/${m.id}`)}
                >
                  View details
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default VolunteerDashboard;