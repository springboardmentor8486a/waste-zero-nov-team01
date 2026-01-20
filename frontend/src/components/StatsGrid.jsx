import React from 'react';

const StatCard = ({ title, value, hint, color }) => (
  <div className="rounded-2xl p-4 shadow-md bg-gradient-to-br from-white to-transparent dark:from-slate-800 dark:to-slate-900 border border-white/50 dark:border-slate-700/50">
    <div className="flex items-center justify-between mb-2">
      <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">{title}</div>
      <div className="text-xs text-slate-400 dark:text-slate-500">{hint}</div>
    </div>
    <div className="mt-2">
      <div className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${color}`}>{value}</div>
      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Quick summary</div>
    </div>
  </div>
);

export default function StatsGrid({ stats, hideThisWeek = false }) {
  // Check if using new volunteer stats or old pickup stats
  const isVolunteerStats = 'opportunitiesJoined' in stats;
  
  if (isVolunteerStats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Opportunities Joined" 
          value={`${stats.opportunitiesJoined ?? 0}`} 
          hint="Total joined" 
          color="from-emerald-400 to-emerald-600" 
        />
        <StatCard 
          title="Days Active" 
          value={`${stats.daysActive ?? 0} days`} 
          hint="Since registration" 
          color="from-blue-400 to-blue-600" 
        />
        <StatCard 
          title="Connections" 
          value={`${stats.connections ?? 0} people`} 
          hint="Messaged" 
          color="from-purple-400 to-purple-600" 
        />
        <StatCard 
          title="Available Opportunities" 
          value={`${stats.availableOpportunities ?? 0}`} 
          hint="Open to join" 
          color="from-orange-400 to-orange-600" 
        />
      </div>
    );
  }
  
  // Fallback for old pickup stats
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard title="Today" value={`${stats.todayPickups ?? 0} pickups`} hint="Pickups scheduled" color="from-emerald-400 to-emerald-600" />
      {!hideThisWeek && <StatCard title="This week" value={`${stats.weekPickups ?? 0} pickups`} hint="Planned" color="from-blue-400 to-blue-600" />}
      <StatCard title="Volunteer hours" value={`${stats.hours ?? 0}`} hint="This week" color="from-purple-400 to-purple-600" />
      <StatCard title="Streak" value={`${stats.streak ?? 0} days`} hint="Active days" color="from-orange-400 to-orange-600" />
    </div>
  );
}
