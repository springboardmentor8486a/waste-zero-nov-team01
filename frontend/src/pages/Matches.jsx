// src/pages/Matches.jsx
const dummyMatches = [
  {
    id: 1,
    title: "Weekend Teaching Volunteer",
    ngoName: "Bright Minds Foundation",
    location: "Hyderabad",
    skills: ["Teaching", "Communication"],
  },
  {
    id: 2,
    title: "Lake Cleanup Drive",
    ngoName: "Green Earth",
    location: "Secunderabad",
    skills: ["Cleaning", "Teamwork"],
  },
];

export default function Matches() {
  return (
    <div className="h-full bg-gray-50 dark:bg-slate-900 p-6">
      <h1 className="text-2xl font-semibold mb-1">Recommended Opportunities</h1>
      <p className="text-xs text-gray-500 mb-5">
        Based on your skills and preferred causes.
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {dummyMatches.map((m) => (
          <div
            key={m.id}
            className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition"
          >
            <p className="text-[11px] uppercase tracking-wide text-emerald-500 mb-1">
              Match found
            </p>
            <h3 className="font-semibold text-lg mb-1">{m.title}</h3>
            <p className="text-xs text-gray-500 mb-1">{m.ngoName}</p>
            <p className="text-xs mb-3">Location: {m.location}</p>
            <div className="flex flex-wrap gap-1 mb-3">
              {m.skills.map((s) => (
                <span
                  key={s}
                  className="text-[10px] px-2 py-1 rounded-full bg-emerald-50 text-emerald-700"
                >
                  {s}
                </span>
              ))}
            </div>
            <button className="w-full text-xs font-semibold py-2 rounded-full bg-emerald-500 text-white hover:bg-emerald-600">
              View details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}