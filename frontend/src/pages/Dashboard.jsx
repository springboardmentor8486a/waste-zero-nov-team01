
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    completedPickups: 0,
    pendingPickups: 0,
    activeOpportunities: 0,
    matchesCreated: 0,
    newMessages: 0
  });

  // Note: Dashboard stats endpoint not yet implemented in backend
  // Admin stats will be added in future phases
  useEffect(() => {
    // fetchDashboardStats(); // Disabled - endpoint not yet available
    // For now, using mock data defined in state
  }, []);

  // Mock refresh - shows mock data since backend endpoint doesn't exist yet
  const handleRefreshStats = () => {
    console.log('Stats would be refreshed when endpoint is implemented');
  };

  const statCards = [
    { 
      title: "Total Volunteers", 
      value: stats.totalUsers.toLocaleString(), 
      change: "+12%",
      icon: "👥",
      color: "from-emerald-500 to-teal-500"
    },
    { 
      title: "Active Opportunities", 
      value: stats.activeOpportunities, 
      change: "+3",
      icon: "🎯", 
      color: "from-blue-500 to-indigo-500"
    },
    {
      title: "Matches Created", 
      value: stats.matchesCreated, 
      change: "+8%",
      icon: "⭐",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "New Messages", 
      value: stats.newMessages, 
      change: "Live",
      icon: "💬",
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Hero Header */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent mb-4 leading-tight">
            Dashboard
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Monitor volunteer matches, manage opportunities, and track platform growth in real-time
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={handleRefreshStats}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300"
            >
              🔄 Refresh Stats
            </button>
            <Link 
              to="/opportunities/create"
              className="px-8 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:from-slate-800 hover:to-slate-700 transition-all duration-300 flex items-center gap-3"
            >
              ➕ New Opportunity
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <StatCard 
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
            <span>⚡</span> Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ActionCard 
              icon="🎯" 
              title="Manage Matches" 
              desc="Review and approve volunteer matches"
              to="/matches"
              color="emerald"
            />
            <ActionCard 
              icon="💬" 
              title="Live Messages" 
              desc="Monitor all conversations"
              to="/messages"
              color="blue"
            />
            <ActionCard 
              icon="👥" 
              title="Users Overview" 
              desc="Manage volunteers and NGOs"
              to="/users"
              color="purple"
            />
            <ActionCard 
              icon="📊" 
              title="Reports" 
              desc="Generate platform analytics"
              to="/reports"
              color="orange"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Matches */}
          <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <span>🎯</span> Recent Matches
            </h3>
            <div className="space-y-4">
              {[1,2,3].map((i) => (
                <RecentMatchItem key={i} />
              ))}
            </div>
          </div>

          {/* Platform Growth */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl shadow-2xl border border-emerald-200/50 p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6">📈 Growth</h3>
            <div className="space-y-6">
              <GrowthStat label="Volunteers" value="124 (+12%)" color="emerald" />
              <GrowthStat label="NGOs" value="23 (+2)" color="teal" />
              <GrowthStat label="Matches" value="89 (+18%)" color="blue" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stats Card Component
function StatCard({ title, value, change, icon, color }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl p-8 bg-white shadow-xl hover:shadow-2xl border border-white/50 hover:border-emerald-200/50 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]">
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/20"></div>
      
      <div className="relative z-10 flex items-center justify-between mb-6">
        <div className={`w-16 h-16 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center shadow-2xl shadow-${color.split('-')[0]}-500/25 group-hover:scale-110 transition-all`}>
          <span className="text-2xl drop-shadow-lg">{icon}</span>
        </div>
      </div>
      
      <div>
        <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2 opacity-80">{title}</p>
        <p className="text-4xl lg:text-3xl xl:text-4xl font-black text-slate-900 mb-1 leading-tight">{value}</p>
        <p className={`text-sm font-bold ${
          change.includes('+') ? 'text-emerald-600' : 'text-slate-500'
        }`}>
          {change}
        </p>
      </div>
    </div>
  );
}

// Action Card
function ActionCard({ icon, title, desc, to, color }) {
  return (
    <Link 
      to={to}
      className={`group p-8 rounded-3xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] border-2 border-transparent hover:border-${color}-200 bg-gradient-to-br from-white to-slate-50 shadow-lg`}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-16 h-16 bg-gradient-to-br from-${color}-500 to-${color}-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all flex-shrink-0`}>
          <span className="text-2xl drop-shadow-lg">{icon}</span>
        </div>
      </div>
      <h4 className="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-slate-950">{title}</h4>
      <p className="text-slate-600 leading-relaxed">{desc}</p>
    </Link>
  );
}

// Recent Match Item
function RecentMatchItem() {
  return (
    <div className="group flex items-center p-6 rounded-3xl bg-slate-50/50 hover:bg-white border border-slate-200/50 hover:shadow-lg hover:border-emerald-200/50 transition-all duration-300 cursor-pointer">
      <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg flex-shrink-0">
        <span className="text-white font-bold">BV</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <h4 className="font-bold text-slate-900 truncate text-lg">Bright Minds Volunteer</h4>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">95%</span>
        </div>
        <p className="text-sm text-slate-600 truncate">Weekend Teaching - Hyderabad</p>
      </div>
      <div className="text-right text-xs text-slate-500 ml-4">
        <div>2 min ago</div>
        <div className="text-emerald-600 font-medium">Active</div>
      </div>
    </div>
  );
}

// Growth Stat
function GrowthStat({ label, value, color }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl backdrop-blur-sm border border-emerald-200/30">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <span className={`font-bold text-lg text-${color}-600`}>{value}</span>
    </div>
  );
}

export default Dashboard;