import React from 'react';

export default function DashboardHeader({ userName, wishlistCount, onRefresh }) {
  return (
    <div className="flex items-center justify-between gap-6 mb-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Volunteer Dashboard</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Welcome back, <span className="font-semibold capitalize">{userName}</span> — ready to make impact today?</p>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={onRefresh} className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-slate-800 dark:from-green-600 dark:to-emerald-500 to-slate-600 dark:hover:from-green-500 dark:hover:to-emerald-400 text-white font-semibold shadow-lg hover:scale-[1.02] transition-transform" aria-label="Refresh dashboard">
          ⟳ Refresh
        </button>
      </div>
    </div>
  );
}
