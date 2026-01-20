import React from 'react';

// CalendarView: simple month grid calendar that places pickups and opportunities on their date.
export default function CalendarView({ pickups = [], opportunities = [], showMonth = null }) {
  // build events map keyed by 'dd.mm.yyyy'
  const toKey = (d) => {
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return null;
    const dd = String(dt.getDate()).padStart(2, '0');
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const yyyy = dt.getFullYear();
    return `${dd}.${mm}.${yyyy}`;
  };

  const events = {};
  pickups.forEach(p => {
    const raw = p.dateISO || p.dateTime || p.date;
    const k = toKey(raw);
    if (!k) return;
    events[k] = events[k] || [];
    events[k].push({ type: 'pickup', text: p.address, id: p.id });
  });
  opportunities.forEach(o => {
    const raw = o.dateISO || o.date || o.dateTime;
    const k = toKey(raw);
    if (!k) return;
    events[k] = events[k] || [];
    events[k].push({ type: 'opportunity', text: o.title, id: o.id });
  });

  // calendar month to render
  const today = new Date();
  const monthBase = showMonth ? new Date(showMonth) : new Date(today.getFullYear(), today.getMonth(), 1);
  const year = monthBase.getFullYear();
  const month = monthBase.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  // day index of week for first day (0=Sun)
  const startWeekday = firstDay.getDay();

  // create array of date objects to render (include blanks at start)
  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  return (
    <div className="rounded-xl border border-slate-100 p-3 bg-white shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-semibold">{monthBase.toLocaleString(undefined, { month: 'long', year: 'numeric' })}</div>
        <div className="text-xs text-slate-500">Legend: <span className="text-emerald-600">●</span> pickup <span className="ml-2 text-blue-600">●</span> opportunity</div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-xs">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
          <div key={d} className="text-center font-semibold text-slate-500">{d}</div>
        ))}

        {cells.map((cell, idx) => {
          if (!cell) return <div key={idx} className="h-20 rounded p-1 bg-slate-50"></div>;
          const key = toKey(cell.toISOString());
          const ev = events[key] || [];
          const dd = String(cell.getDate()).padStart(2, '0');
          return (
            <div key={idx} className="h-20 rounded p-2 bg-white border border-slate-100 shadow-sm flex flex-col justify-start">
              <div className="flex items-center justify-between mb-1">
                <div className="text-xs font-bold">{dd}</div>
              </div>
              <div className="flex-1 overflow-hidden text-[11px] space-y-1">
                {ev.slice(0,3).map((e, i) => (
                  <div key={i} className={`truncate ${e.type === 'pickup' ? 'text-emerald-700' : 'text-blue-700'}`}>{e.text}</div>
                ))}
                {ev.length > 3 && <div className="text-[10px] text-slate-400">+{ev.length-3} more</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}