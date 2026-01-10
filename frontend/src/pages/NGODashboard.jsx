// src/pages/Ngodashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { formatDistanceToNow, format } from "date-fns";

const KPI = ({ label, value, hint }) => (
  <div className="bg-white rounded-xl shadow-sm border p-4">
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <p className="text-2xl font-semibold text-gray-900">{value}</p>
    {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
  </div>
);

const ActivityItem = ({ item }) => {
  const when = item.timestamp ? new Date(item.timestamp) : new Date(item.createdAt);
  return (
    <div className="flex items-start space-x-3 py-3 border-b last:border-b-0">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-700">
        {item.type === "message" ? "M" : "O"}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-800">{item.title}</p>
          <p className="text-xs text-gray-400">{formatDistanceToNow(when, { addSuffix: true })}</p>
        </div>
        <p className="text-sm text-gray-600 mt-1">{item.subtitle}</p>
        {item.link && (
          <Link to={item.link} className="text-xs text-blue-600 hover:underline mt-1 inline-block">
            View
          </Link>
        )}
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

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const [opRes, convRes] = await Promise.all([
          api.get("/opportunities"),
          api.get("/messages/conversations"),
        ]);

        const opportunities = opRes.data || [];
        const conversations = Array.isArray(convRes.data) ? convRes.data : [];

        if (!mounted) return;

        // Filter opportunities owned by this NGO (flexible check)
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
        if (!mounted) return;
        setError("Failed to load dashboard data");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [user]);

  const activeCount = useMemo(() => opps.filter((o) => o.status !== "closed").length, [opps]);
  const conversationsCount = useMemo(() => convos.length, [convos]);

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
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {user?.name || "NGO Partner"}
        </h1>
        <p className="text-sm text-gray-600 mt-1">Manage opportunities and view recent activity here.</p>
      </div>

      {/* KPI bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPI label="Active Opportunities" value={loading ? "..." : activeCount} hint={`${opps.length} total`} />
        <KPI label="Conversations" value={loading ? "..." : conversationsCount} hint="Recent chats" />
        <KPI label="Upcoming Drives" value={loading ? "..." : opps.filter(o => new Date(o.date) > new Date()).length} hint="Scheduled events" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Profile + Recent Activity */}
        <section className="bg-white rounded-xl shadow-sm border p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">NGO Profile</h2>
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium text-gray-800">Name: </span>
            {user?.name || "NGO Name"}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium text-gray-800">Email: </span>
            {user?.email}
          </p>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Recent Activity</h3>
            {loading && <p className="text-sm text-gray-500">Loading activity…</p>}
            {error && <p className="text-sm text-red-500">{error}</p>}
            {!loading && recentActivity.length === 0 && (
              <p className="text-sm text-gray-500">No recent activity. Create an opportunity or start a chat to see updates here.</p>
            )}
            <div className="mt-3">
              {recentActivity.map((item, idx) => (
                <ActivityItem key={idx} item={item} />
              ))}
            </div>
          </div>
        </section>

        {/* Right: Quick actions */}
        <section className="bg-white rounded-xl shadow-sm border p-5 space-y-3">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Quick Actions</h2>

          <Link to="/opportunities/create" className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg">
            + Create Opportunity
          </Link>

          <Link to="/opportunities" className="block w-full text-center border border-gray-300 text-sm font-medium text-gray-800 py-2.5 rounded-lg hover:bg-gray-50">
            View All Opportunities
          </Link>

          <Link to="/schedule-pickup" className="block w-full text-center border border-gray-300 text-sm font-medium text-gray-800 py-2.5 rounded-lg hover:bg-gray-50">
            Schedule Pickup
          </Link>

          <Link to="/messages" className="block w-full text-center bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2.5 rounded-lg">
            View Messages
          </Link>

          <button
            onClick={() => alert("Announcement composer coming soon — implement broadcast API or use Messages to contact volunteers.")}
            className="block w-full text-center text-sm font-medium text-gray-700 py-2.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            Send Announcement
          </button>

          <Link to="/profile" className="block w-full text-center text-xs text-blue-600 hover:underline mt-1">Edit NGO profile</Link>
        </section>
      </div>
    </div>
  );
};

export default Ngodashboard;