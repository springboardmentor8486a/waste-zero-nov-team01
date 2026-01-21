import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function OpportunityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();

  // 🔹 matches state (NGO Match View)
  const [matches, setMatches] = useState([]);
  const [matchesLoading, setMatchesLoading] = useState(true);

  useEffect(() => {
    fetchOpportunity();
    // Only fetch matches if logged in as NGO (matches/:id requires NGO auth)
    if (user?.role === "ngo") {
      fetchMatches();
    } else {
      setMatches([]);
      setMatchesLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user?.role]);

  const fetchOpportunity = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/api/opportunities/${id}`
      );

      if (!res.ok) {
        const text = `Failed to load opportunity (${res.status})`;
        console.warn('OpportunityDetails: ' + text);
        setError(text);
        setOpportunity(null);
        return;
      }

      const data = await res.json();
      setOpportunity(data || null);
    } catch (err) {
      console.error("Fetch opportunity error:", err);
      setError(err.message || 'Failed to load opportunity');
      setOpportunity(null);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 GET /matches/:opportunityId – matched volunteers for this opportunity
  const fetchMatches = async () => {
    try {
      setMatchesLoading(true);
      const token = localStorage.getItem("wastezero_token");
      const res = await fetch(
        `http://localhost:5000/api/matches/${id}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (!res.ok) {
        // 401 / 403 are expected if not authorized or not owner — handle gracefully
        if (res.status === 401) {
          console.warn("Matches API returned 401 — not authenticated for matches endpoint");
        } else if (res.status === 403) {
          console.warn("Matches API returned 403 — you are not the owner of this opportunity");
        }
        setMatches([]);
        return;
      }

      const data = await res.json();
      setMatches(data || []);
    } catch (err) {
      console.error("Fetch matches error:", err);
      setMatches([]);
    } finally {
      setMatchesLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this opportunity?"
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("wastezero_token");
      if (!token) {
        alert("Please login again as NGO");
        return;
      }

      const res = await fetch(
        `http://localhost:5000/api/opportunities/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to delete opportunity");
      }

      alert("Opportunity deleted successfully");
      navigate("/opportunities");
    } catch (err) {
      console.error("Delete opportunity error:", err);
      alert(err.message || "Failed to delete opportunity");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Loading opportunity...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-rose-600">{error}</div>;
  }

  const effectiveId = opportunity._id;
  const skills =
    opportunity.required_skills ||
    opportunity.requiredSkills ||
    [];

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      {/* Back link */}
      <Link
        to="/opportunities"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-3"
      >
        <span className="mr-2">←</span> Back to Opportunities
      </Link>

      {/* Title + status */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-slate-100 mb-1">
            {opportunity.title}
          </h1>
          <p className="text-xs text-gray-500">
            Volunteer opportunity details
          </p>
        </div>
        <StatusPill status={opportunity.status || "open"} />
      </div>

      {/* Location map */}
      <div className="mb-6">
        {opportunity.location ? (
          <iframe
            title="Opportunity location map"
            src={`https://www.google.com/maps?q=${encodeURIComponent(opportunity.location)}&output=embed`}
            className="w-full h-64 rounded-xl border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="w-full h-64 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-sm text-slate-500">
            Location not specified
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: description & skills */}
        <section className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div>
            <h2 className="text-sm font-semibold mb-2">Description</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {opportunity.description}
            </p>
          </div>

          {/* Date / Duration / Location summary */}
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
              <p className="text-xs font-semibold uppercase text-gray-500">
                Date
              </p>
              <p className="text-sm text-gray-800">
                {opportunity.date || "Not specified"}
              </p>
            </div>

            <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
              <p className="text-xs font-semibold uppercase text-gray-500">
                Duration
              </p>
              <p className="text-sm text-gray-800">
                {opportunity.duration || "Not specified"}
              </p>
            </div>

            <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
              <p className="text-xs font-semibold uppercase text-gray-500">
                Location
              </p>
              <p className="text-sm text-gray-800">
                {opportunity.location || "Not specified"}
              </p>
            </div>
          </div>

          {/* Required Skills */}
          <div>
            <h2 className="text-sm font-semibold mb-2">Required Skills</h2>
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No specific skills mentioned for this opportunity.
              </p>
            )}
          </div>
        </section>

        {/* RIGHT: details + matched volunteers */}
        <aside className="bg-white border rounded-xl shadow-sm p-4 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">
            Opportunity Details
          </h3>

          <DetailRow
            label="Date"
            value={opportunity.date ? new Date(opportunity.date).toLocaleDateString() : "Not specified"}
          />
          <DetailRow
            label="Duration"
            value={opportunity.duration || "Not specified"}
          />
          <DetailRow
            label="Location"
            value={opportunity.location || "Not specified"}
          />
          <DetailRow
            label="Posted by"
            value={opportunity.postedBy || "Unknown"}
          />

          {/* 🔹 Matched volunteers list */}
<div className="pt-3 border-t border-gray-200 mt-2">
  <h4 className="text-xs font-semibold text-gray-700 mb-2">
    Matched Volunteers
  </h4>

  {matchesLoading ? (
    <p className="text-xs text-gray-500">Loading matches...</p>
  ) : matches.length === 0 ? (
    <div className="p-3 bg-gray-50 rounded-lg text-center border border-dashed border-gray-300">
      <p className="text-[11px] text-gray-500">
        No matching volunteers found for these skills yet.
      </p>
    </div>
  ) : (
    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
      {matches.map((v, index) => {
        // Normalize backend response: support { volunteer: {...}, score } and older shapes
        const vol = v.volunteer || v.volunteerId || v;
        const vId = vol?._id || vol?.id || v._id || v.id || index;
        const vName = vol?.name || v.name || "Volunteer";
        const vSkills = vol?.skills || v.skills || [];
        const vLocation = vol?.location || v.location || "Remote";
        const score = v.score ?? v.matchScore ?? null;

        return (
          <div
            key={vId || index}
            className="rounded-lg border border-gray-200 p-3 bg-white shadow-sm hover:border-blue-300 transition-colors"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600">
                {vName.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{vName}</p>
                {score !== null && (
                  <div className="text-xs text-gray-500">Match score: <span className="font-semibold text-gray-700">{score}</span></div>
                )}
              </div>
            </div>

            <p className="text-[11px] text-gray-500 flex items-center gap-1">
              📍 {vLocation}
            </p>

            <div className="mt-2 flex flex-wrap gap-1">
              {Array.isArray(vSkills) && vSkills.slice(0, 3).map((s, i) => (
                <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[11px] rounded">
                  {s}
                </span>
              ))}
            </div>

            <button
              onClick={() => navigate(`/chat/${vId}`)}
              className="mt-3 w-full py-2 rounded-md bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 shadow-sm transition-all"
            >
              Message Volunteer
            </button>
          </div>
        );
      })}
    </div>
  )}
</div>         
          {user?.role !== "volunteer" && (
            <div className="flex justify-end gap-2 pt-2">
              <Link
                to={`/opportunities/${effectiveId}/edit`}
                className="px-4 py-2 rounded-lg border text-sm font-medium"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium"
              >
                Delete
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const base =
    "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold";
  const norm = (status || "").toLowerCase();
  const style =
    norm === "open"
      ? "bg-green-100 text-green-800"
      : norm === "closed"
      ? "bg-gray-100 text-gray-600"
      : "bg-amber-100 text-amber-700";

  return <span className={`${base} ${style}`}>{status}</span>;
}

function DetailRow({ label, value }) {
  return (
    <div className="text-xs">
      <div className="text-gray-400 mb-0.5">{label}</div>
      <div className="text-gray-800">{value}</div>
    </div>
  );
}

export default OpportunityDetails;