// src/pages/Ngodashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { formatDistanceToNow, format } from "date-fns";
import { FiBriefcase, FiMessageCircle, FiCalendar, FiPlusCircle, FiClock, FiMail } from "react-icons/fi";

// Simple count animation hook
function useCount(target, duration = 600) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const start = 0;
    if (!target || target === start) {
      setCount(target);
      return;
    }
    const steps = 24;
    let current = start;
    const increment = (target - start) / steps;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      current += increment;
      if (i >= steps) {
        setCount(target);
        clearInterval(id);
      } else {
        setCount(Math.round(current));
      }
    }, Math.max(10, Math.round(duration / steps)));
    return () => clearInterval(id);
  }, [target, duration]);
  return count;
}

const KPI = ({ label, icon: Icon, value, hint, className }) => {
  const animated = useCount(typeof value === 'number' ? value : 0);
  return (
    <div className={`bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border p-5 flex items-center gap-4 transform transition-all duration-400 hover:scale-105 ${className}`}>
      <div className="p-3 rounded-lg bg-white/70 shadow-inner text-2xl text-emerald-600">
        <Icon />
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{typeof value === 'number' ? animated : value}</p>
        {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      </div>
    </div>
  );
};

const ActivityItem = ({ item }) => {
  const when = item.timestamp ? new Date(item.timestamp) : new Date(item.createdAt);
  return (
    <div className="flex items-start gap-3 py-3 border-b last:border-b-0 hover:bg-slate-50 px-2 rounded transition-colors">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center text-xs font-semibold text-emerald-700">
        {item.type === "message" ? <FiMail /> : <FiCalendar />}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-800">{item.title}</p>
          <p className="text-xs text-gray-400">{formatDistanceToNow(when, { addSuffix: true })}</p>
        </div>
        <p className="text-sm text-gray-600 mt-1 truncate">{item.subtitle}</p>

      </div>
    </div>
  );
};

const Ngodashboard = () => {
  const { user } = useAuth();
  const [opps, setOpps] = useState([]);
  const [convos, setConvos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let mountedFlag = true;
    async function load() {
      setLoading(true);
      try {
        const [opRes, convRes] = await Promise.all([
          api.get("/opportunities"),
          api.get("/messages/conversations"),
        ]);

        const opportunities = opRes.data || [];
        const conversations = Array.isArray(convRes.data) ? convRes.data : [];

        if (!mountedFlag) return;

        const myOpps = opportunities.filter((o) => {
          if (!o.ngo_id) return false;
          const ngoId = o.ngo_id._id || o.ngo_id.id || o.ngo_id;
          return String(ngoId) === String(user?.id || user?._id || user?._id);
        });

        setOpps(myOpps);
        setConvos(conversations);
        setError(null);
      } catch (err) {
        console.error("NGODashboard: load error", err.message || err);
        if (!mountedFlag) return;
        setError("Failed to load dashboard data");
      } finally {
        if (!mountedFlag) return;
        setLoading(false);
      }
    }

    load();

    return () => {
      mountedFlag = false;
    };
  }, [user]);

  const activeCount = useMemo(() => opps.filter((o) => o.status !== "closed").length, [opps]);
  const conversationsCount = useMemo(() => convos.length, [convos]);
  const upcomingCount = useMemo(() => opps.filter((o) => new Date(o.date) > new Date()).length, [opps]);

  const recentActivity = useMemo(() => {
    const oppItems = opps
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map((o) => ({
        type: "opportunity",
        title: o.title,
        subtitle: `Posted — ${format(new Date(o.createdAt), "MMM d, yyyy h:mm a")}`,
        timestamp: o.createdAt,
        link: `/opportunities/${o._id}`,
      }));

    const msgItems = convos
      .slice()
      .sort((a, b) => new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp))
      .slice(0, 5)
      .map((c) => ({
        type: "message",
        title: `Message from ${c.otherUserName}`,
        subtitle: c.lastMessage.text,
        timestamp: c.lastMessage.timestamp,
        link: `/messages/${c.otherUserId}`,
      }));

    const merged = [...oppItems, ...msgItems].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return merged.slice(0, 5);
  }, [opps, convos]);

  return (
    <div className={`p-6 space-y-6 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} transition-all duration-500`}>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
          <span className="text-3xl text-emerald-600">🌿</span> Welcome back, {user?.name || "NGO Partner"}
        </h1>
        <p className="text-sm text-gray-600 mt-1">Manage opportunities and view recent activity here.</p>
      </div>

      {/* KPI bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPI label="Active Opportunities" icon={FiBriefcase} value={loading ? "..." : activeCount} hint={`${opps.length} total`} className="" />
        <KPI label="Conversations" icon={FiMessageCircle} value={loading ? "..." : conversationsCount} hint="Recent chats" />
        <KPI label="Upcoming Drives" icon={FiCalendar} value={loading ? "..." : upcomingCount} hint="Scheduled events" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Profile + Recent Activity */}
        <section className="bg-white rounded-2xl shadow-2xl border p-5 lg:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-3">NGO Profile</h2>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium text-gray-800">Name: </span>
                {user?.name || "NGO Name"}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium text-gray-800">Email: </span>
                {user?.email}
              </p>
            </div>
            <div className="text-right">
              <Link to="/profile" className="inline-flex items-center gap-2 text-xs px-3 py-2 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition">Edit Profile</Link>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Recent Activity
            </h3>
            {loading && <p className="text-sm text-gray-500">Loading activity…</p>}
            {error && <p className="text-sm text-red-500">{error}</p>}
            {!loading && recentActivity.length === 0 && (
              <p className="text-sm text-gray-500">No recent activity. Create an opportunity or start a chat to see updates here.</p>
            )}
            <div className="mt-3 rounded-md border border-gray-100 overflow-hidden">
              {recentActivity.map((item, idx) => (
                <ActivityItem key={idx} item={item} />
              ))}
            </div>
          </div>
        </section>

        {/* Right: Quick actions */}
        <section className="bg-white rounded-2xl shadow-2xl border p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700">Quick Actions</h2>
            <span className="text-xs text-slate-400">Fast links</span>
          </div>

          <Link to="/opportunities/create" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-medium hover:from-emerald-700 hover:to-teal-600 transition shadow-md">
            <FiPlusCircle className="text-lg" />
            Create Opportunity
          </Link>

          <Link to="/opportunities" className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:shadow hover:border-gray-300 transition">
            <FiBriefcase className="text-lg text-emerald-600" />
            View All Opportunities
          </Link>

          <Link to="/schedule-pickup" className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:shadow hover:border-gray-300 transition">
            <FiClock className="text-lg text-amber-600" />
            Schedule Pickup
          </Link>

          <Link to="/messages" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition shadow-md">
            <FiMessageCircle className="text-lg" />
            View Messages
          </Link>

          <Link to="/messages" state={{ compose: true }} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition border border-gray-200">
            <FiMail className="text-lg text-slate-700" />
            Send Announcement
          </Link>

          <Link to="/profile" className="block w-full text-center text-xs text-blue-600 hover:underline mt-1">Edit NGO profile</Link>
        </section>
      </div>

      <style>{`
        /* small responsive tweaks */
        @media (min-width: 1024px) {
          .kpi-big { padding-left: 1rem; padding-right: 1rem; }
        }
      `}</style>
    </div>
  );
};

export default Ngodashboard;