import React, { useState, useEffect } from 'react';


const VolunteerDashboard = () => {
  const [userName, setUserName] = useState('John'); // Default
  const [stats, setStats] = useState({
    pickups: 635,
    recycled: 243,
    co2: 67,
    hours: 124.5
  });

  const [upcomingPickups, setUpcomingPickups] = useState([]);
  const [recyclingData, setRecyclingData] = useState([
    { name: 'Plastic', percent: 40, color: '#FF6B6B' },
    { name: 'Paper', percent: 25, color: '#4ECDC4' },
    { name: 'Glass', percent: 20, color: '#45B7D1' },
    { name: 'E-Waste', percent: 10, color: '#96CEB4' },
    { name: 'Organic', percent: 5, color: '#FFEAA7' }
  ]);

  // Login user name fetch
  useEffect(() => {
    const loggedInUser = localStorage.getItem('userName') || 
                        sessionStorage.getItem('userName') ||
                        'Volunteer'; // Fallback
    setUserName(loggedInUser);
    
    // Mock API - real backend calls add cheyyandi
    setUpcomingPickups([]);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header - Dynamic username */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Volunteer Dashboard</h1>
        <div className="text-sm text-gray-500">
          Welcome back, <span className="font-semibold text-gray-800 capitalize">{userName}</span>! Your waste management view
        </div>
      </div>

      {/* Stats Cards - Exact same */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Pickups" value={stats.pickups} change={-28} color="bg-blue-500" />
        <StatCard title="Recycled Items" value={stats.recycled} change={12} color="bg-green-500" />
        <StatCard title="CO2 Saved (kg)" value={stats.co2} change={17} color="bg-purple-500" />
        <StatCard title="Volunteer Hours" value={stats.hours} change={14} color="bg-orange-500" />
      </div>

      {/* Main Content - Same */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <svg className="w-7 h-7 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Upcoming Pickups
          </h2>
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {upcomingPickups.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                      No upcoming pickups scheduled.
                    </td>
                  </tr>
                ) : (
                  upcomingPickups.map((pickup, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pickup.dateTime}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pickup.address}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">{pickup.status}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900">View</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <svg className="w-7 h-7 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            Recycling Breakdown
          </h2>
          
          <div className="space-y-4 mb-8">
            {recyclingData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{item.name}</span>
                <div className="w-20 flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
                    <div className="h-2 rounded-full transition-all duration-300" style={{ width: `${item.percent}%`, backgroundColor: item.color }} />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{item.percent}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-6 border-t border-gray-100">
            <div className="text-2xl font-bold text-gray-900 mb-1">124.5 kg</div>
            <div className="text-sm text-gray-500">Total Collected</div>
            <div className="text-xs text-green-600 font-medium mt-1">+14% from last month</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, change, color }) => {
  const isPositive = change >= 0;
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-gray-500">{title}</div>
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
      <div className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'} flex items-center`}>
        <span className={`w-3 h-3 ${isPositive ? 'text-green-500' : 'text-red-500'} mr-1`}>
          {isPositive ? '↗' : '↘'}
        </span>
        <span>{Math.abs(change)}% from last month</span>
      </div>
    </div>
  );
};

export default VolunteerDashboard;