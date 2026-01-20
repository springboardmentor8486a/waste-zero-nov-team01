import React from 'react';

export default function UpcomingPickups({ pickups = [], onComplete, loading = false }) {
  if (loading) return <div className="py-8 text-center text-slate-500">Loading pickups…</div>;

  return (
    <div className="space-y-4">
      {pickups.length === 0 ? (
        <div className="py-8 text-center text-slate-500">No pickups scheduled — good time to browse opportunities.</div>
      ) : (
        pickups.map(p => (
          <div key={p.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:shadow-md transition-shadow transform hover:-translate-y-1 bg-gradient-to-r from-white to-slate-50">
            <div>
              <div className="text-sm text-slate-500">{p.dateTime}</div>
              <div className="font-semibold text-slate-900">{p.address}</div>
              <div className="text-xs text-slate-400 mt-1">Status: <span className="font-medium text-emerald-600">{p.status}</span></div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => onComplete(p.id)} className="px-4 py-2 bg-emerald-500 text-white rounded-lg shadow-sm hover:bg-emerald-600 transition">Complete</button>
              <button className="px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-100 transition">View</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
