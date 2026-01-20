import React from 'react';
import { formatDistanceToNow, format } from 'date-fns';

const ActivityItem = ({ item }) => {
  const when = item.timestamp ? new Date(item.timestamp) : null;
  return (
    <div className="flex items-start gap-3 py-3 border-b dark:border-slate-700 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 px-2 rounded transition-colors">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-50 dark:from-emerald-900/30 to-emerald-100 dark:to-emerald-800/30 flex items-center justify-center text-xs font-semibold text-emerald-700 dark:text-emerald-400">
        {item.type === 'pickup' ? '🚚' : item.type === 'opportunity' ? '🌿' : '⭐'}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-800 dark:text-slate-100">{item.title}</p>
          <p className="text-xs text-gray-400 dark:text-slate-500">{when ? formatDistanceToNow(when, { addSuffix: true }) : ''}</p>
        </div>
        <p className="text-sm text-gray-600 dark:text-slate-400 mt-1 truncate">{item.subtitle}</p>
      </div>
    </div>
  );
};

export default function RecentActivities({ activities = [], loading = false }) {
  if (loading) return <div className="py-8 text-center text-slate-500 dark:text-slate-400">Loading activity…</div>;
  if (!activities || activities.length === 0) return <div className="py-8 text-center text-slate-500 dark:text-slate-400">No recent activity yet — join an opportunity or complete a pickup to see updates here.</div>;

  return (
    <div className="mt-3 rounded-md border border-gray-100 dark:border-slate-700 overflow-hidden">
      {activities.map((a, i) => <ActivityItem key={i} item={a} />)}
    </div>
  );
}