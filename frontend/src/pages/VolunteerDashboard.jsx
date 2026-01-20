import React, { useState, useEffect } from 'react';
import VolunteerApi from '../hooks/useVolunteerApi';
import DashboardHeader from '../components/DashboardHeader';
import StatsGrid from '../components/StatsGrid';
import OpportunitiesPanel from '../components/OpportunitiesPanel';
import RecentActivities from '../components/RecentActivities';

const VolunteerDashboard = () => {
  const [userName, setUserName] = useState('Volunteer');
  const [toast, setToast] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  // Stats — default to zeros; will be populated from backend
  const [stats, setStats] = useState({
    opportunitiesJoined: 0,
    daysActive: 0,
    connections: 0,
    availableOpportunities: 0
  });

  // Upcoming pickups (loaded from backend)
  const [upcomingPickups, setUpcomingPickups] = useState([]);

  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [queuedCount, setQueuedCount] = useState(VolunteerApi.getQueuedCount());

  // Nearby opportunities (loaded from backend)
  const [opportunities, setOpportunities] = useState([]);
  const [joinedOpportunities, setJoinedOpportunities] = useState([]);
  const [joinedDetails, setJoinedDetails] = useState([]);

  const WISHLIST_KEY = 'volunteer_wishlist_v1';
  const [wishlist, setWishlist] = useState(() => {
    try {
      const raw = localStorage.getItem(WISHLIST_KEY) || '[]';
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  });

  // helper: format date to dd.mm.yyyy and datetime to dd.mm.yyyy HH:MM
  const formatDate = (input) => {
    const d = new Date(input);
    if (Number.isNaN(d.getTime())) return input;
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}.${mm}.${yyyy}`;
  };

  const formatDateTime = (input) => {
    const d = new Date(input);
    if (Number.isNaN(d.getTime())) return input;
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${dd}.${mm}.${yyyy} ${hh}:${min}`;
  };

  const [loadingPickups, setLoadingPickups] = useState(true);
  const [loadingOpportunities, setLoadingOpportunities] = useState(true);

  // Centralized dashboard fetch so we can refresh on-demand
  const fetchDashboardData = async () => {
    let mounted = true; // local flag for this call
    try {
      setLoadingPickups(true);
      setLoadingOpportunities(true);

      const [wishlistData, dashboardData, joined, conversations, userProfile] = await Promise.all([
        VolunteerApi.getWishlist(), 
        VolunteerApi.getDashboardSummary(), 
        VolunteerApi.getMyJoined(),
        VolunteerApi.getMyConversations(),
        VolunteerApi.getMyProfile()
      ]);
      setFetchError(null);

      if (Array.isArray(wishlistData)) {
        const ids = wishlistData.map(i => i._id || i.id || i);
        setWishlist(ids);
      }

      if (Array.isArray(joined)) {
        setJoinedOpportunities(joined.map(o => o._id || o.id));
        setJoinedDetails(joined);
      }

      if (dashboardData) {
        const { stats: s, upcoming, opportunities: opps } = dashboardData;
        
        // Calculate days active from user profile createdAt
        let daysActive = 0;
        if (userProfile && userProfile.createdAt) {
          const registrationDate = new Date(userProfile.createdAt);
          const today = new Date();
          daysActive = Math.floor((today - registrationDate) / (1000 * 60 * 60 * 24)) + 1;
        }
        
        // Count unique connections from conversations
        const connectionsCount = Array.isArray(conversations) ? conversations.length : 0;
        
        const opportunitiesJoined = (joined && joined.length) || 0;
        const availableOpportunities = (opps && opps.length) || 0;
        
        setStats(prev => ({ 
          ...prev, 
          opportunitiesJoined: opportunitiesJoined,
          daysActive: daysActive,
          connections: connectionsCount,
          availableOpportunities: availableOpportunities
        }));
        setUpcomingPickups(upcoming?.map(p => ({ id: p._id, dateISO: p.dateTime, dateTime: formatDateTime(p.dateTime), address: p.address, status: p.status, lat: p.lat, lng: p.lng })) || []);
        setOpportunities(opps?.map(o => ({ id: o._id, title: o.title, org: (o.ngo_id && o.ngo_id.name) ? (o.ngo_id.name) : (o.location || 'Local NGO'), date: formatDate(o.date), seats: o.seats || 10, peopleJoined: o.peopleJoined || 0, color: 'from-emerald-400 to-emerald-600' })) || []);
        setLoadingPickups(false);
        setLoadingOpportunities(false);
        return;
      }

      // fallback
      setFetchError('Unable to fetch dashboard summary from server. Attempting individual endpoints.');
      console.warn('VolunteerDashboard: dashboardData empty — check backend /api/pickups/dashboard/summary');

      const [myPickups, opps] = await Promise.all([VolunteerApi.getMyPickups(), VolunteerApi.getOpportunities()]);
      
      // Calculate days active from user profile
      let daysActive = 0;
      if (userProfile && userProfile.createdAt) {
        const registrationDate = new Date(userProfile.createdAt);
        const today = new Date();
        daysActive = Math.floor((today - registrationDate) / (1000 * 60 * 60 * 24)) + 1;
      }
      
      // Count unique connections from conversations
      const connectionsCount = Array.isArray(conversations) ? conversations.length : 0;
      
      const opportunitiesJoined = (joined && joined.length) || 0;
      const availableOpportunities = (opps && opps.length) || 0;
      
      setStats(prev => ({ 
        ...prev,
        opportunitiesJoined: opportunitiesJoined,
        daysActive: daysActive,
        connections: connectionsCount,
        availableOpportunities: availableOpportunities
      }));
      
      setUpcomingPickups(myPickups.map(p => ({ id: p._id || p.id, dateISO: p.dateTime || p.date, dateTime: formatDateTime(p.dateTime || p.date), address: p.address || p.location || 'Unknown', status: p.status || 'Scheduled', lat: p.lat, lng: p.lng })));
      setOpportunities(opps.map(o => ({ id: o._id || o.id, title: o.title, org: (o.ngo_id && o.ngo_id.name) ? o.ngo_id.name : (o.location || 'Local NGO'), date: formatDate(o.date || o.dateTime), seats: o.seats || 10, peopleJoined: o.peopleJoined || 0, color: 'from-emerald-400 to-emerald-600' })));
      setLoadingPickups(false);
      setLoadingOpportunities(false);
    } catch (e) {
      setFetchError('Error fetching dashboard: ' + (e?.response?.statusText || e.message));
      console.error('Error fetching dashboard or wishlist:', e);
      setLoadingPickups(false);
      setLoadingOpportunities(false);
    }
  };

  useEffect(() => {
    const loggedInUser = localStorage.getItem('userName') || sessionStorage.getItem('userName') || 'Volunteer';
    setUserName(loggedInUser);

    fetchDashboardData();
  }, []);

  useEffect(() => {
    // persist wishlist
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setToast('Back online — syncing queued actions');
      VolunteerApi.processQueue((id) => {
        setToast(`Synced pickup ${id}`);
        setTimeout(() => setToast(null), 1500);
      }).then(remaining => {
        setQueuedCount(remaining);
        // refresh dashboard from server when sync completes
        fetchDashboardData();

        setTimeout(() => setToast(null), 1000);
      });
    };
    const handleOffline = () => {
      setIsOnline(false);
      setToast('You are offline — actions will be queued');
      setTimeout(() => setToast(null), 1500);
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleWishlist = async (op) => {
    // try server-side wishlist first
    try {
      if (!wishlist.includes(op.id)) {
        const res = await VolunteerApi.addToWishlistApi(op.id);
        if (res) {
          setWishlist(prev => {
            const next = [...prev, op.id];
            setToast('Added to wishlist');
            setTimeout(() => setToast(null), 1500);
            return next;
          });
          return;
        }
      } else {
        const res = await VolunteerApi.removeFromWishlistApi(op.id);
        if (res) {
          setWishlist(prev => prev.filter(id => id !== op.id));
          setToast('Removed from wishlist');
          setTimeout(() => setToast(null), 1500);
          return;
        }
      }
    } catch (e) {
      // Save locally if server is unreachable; will sync when online
      setWishlist(prev => {
        const exists = prev.includes(op.id);
        const next = exists ? prev.filter(id => id !== op.id) : [...prev, op.id];
        setToast(exists ? 'Removed from wishlist (saved locally)' : 'Added to wishlist (saved locally)');
        setTimeout(() => setToast(null), 2000);
        return next;
      });
    }
  };


  const joinOpportunity = async (op) => {
    if (joinedOpportunities.includes(op.id)) {
      setToast('You have already joined this opportunity');
      setTimeout(() => setToast(null), 1500);
      return;
    }

    try {
      // optimistic UI: mark as joined
      setJoinedOpportunities(prev => [...prev, op.id]);
      setOpportunities(prev => prev.map(item => item.id === op.id ? { ...item, peopleJoined: (item.peopleJoined || 0) + 1 } : item));

      await VolunteerApi.joinOpportunityApi(op.id);
      setToast('Joined opportunity — success');
      setTimeout(() => setToast(null), 1500);
    } catch (e) {
      // revert optimistic update on failure
      setJoinedOpportunities(prev => prev.filter(id => id !== op.id));
      setOpportunities(prev => prev.map(item => item.id === op.id ? { ...item, peopleJoined: Math.max(0, (item.peopleJoined || 1) - 1) } : item));

      const msg = e?.response?.data?.message || e?.message || 'Failed to join opportunity';
      setToast(msg);
      setTimeout(() => setToast(null), 2500);
    }
  };

  const leaveOpportunity = async (op) => {
    if (!joinedOpportunities.includes(op.id)) {
      setToast('You have not joined this opportunity');
      setTimeout(() => setToast(null), 1500);
      return;
    }

    try {
      // optimistic UI: remove joined
      setJoinedOpportunities(prev => prev.filter(id => id !== op.id));
      setOpportunities(prev => prev.map(item => item.id === op.id ? { ...item, peopleJoined: Math.max(0, (item.peopleJoined || 1) - 1) } : item));

      await VolunteerApi.leaveOpportunityApi(op.id);
      setToast('Left opportunity');
      setTimeout(() => setToast(null), 1500);
    } catch (e) {
      // revert optimistic removal on failure
      setJoinedOpportunities(prev => [...prev, op.id]);
      setOpportunities(prev => prev.map(item => item.id === op.id ? { ...item, peopleJoined: (item.peopleJoined || 0) + 1 } : item));

      const msg = e?.response?.data?.message || e?.message || 'Failed to leave opportunity';
      setToast(msg);
      setTimeout(() => setToast(null), 2500);
    }
  };

  const completePickup = async (id) => {
    // Optimistic UI: remove from list
    setUpcomingPickups(prev => prev.filter(p => p.id !== id));
    setStats(s => ({ ...s, todayPickups: Math.max(0, s.todayPickups - 1), weekPickups: Math.max(0, s.weekPickups - 1) }));

    if (!navigator.onLine) {
      // enqueue
      VolunteerApi.enqueuePickupComplete(id);
      setQueuedCount(VolunteerApi.getQueuedCount());
      setToast('Offline — completion queued and will sync when online');
      setTimeout(() => setToast(null), 2000);
      return;
    }

    try {
      await VolunteerApi.completePickup(id);
      setToast('Pickup completed — synced');
      setTimeout(() => setToast(null), 1500);
    } catch (e) {
      // on failure, enqueue
      VolunteerApi.enqueuePickupComplete(id);
      setQueuedCount(VolunteerApi.getQueuedCount());
      setToast('Network issue — queued and will retry');
      setTimeout(() => setToast(null), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 p-6 md:p-10">
      <DashboardHeader userName={userName} wishlistCount={wishlist.length} onRefresh={() => fetchDashboardData()} />

      {/* Fetch error banner */}
      {fetchError && (
        <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 text-rose-700 dark:text-rose-300">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-semibold mb-1">Dashboard sync issue</div>
              <div className="text-sm">{fetchError}</div>
            </div>
            <div className="text-right text-xs">
              <div className="mb-2">Possible fixes:</div>
              <div className="space-y-1">
                <div>- Ensure backend is running and reachable at <code>http://localhost:5000</code></div>
                <div>- Restart backend dev server (e.g., stop and run <code>npm run dev</code>)</div>
                <div>- Check auth token (stored in <code>localStorage.wastezero_token</code>)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <StatsGrid stats={stats} hideThisWeek={true} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Recent Activity + Nearby + Wishlist stacked */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Recent Activity</h2>
            <div className="text-sm text-slate-500 dark:text-slate-400">Latest actions from your account</div>
          </div>

          <RecentActivities activities={(function(){
            const items = [];
            // pickups
            upcomingPickups.slice().reverse().slice(0,5).forEach(p => items.push({ type:'pickup', title: 'Pickup scheduled', subtitle: p.address, timestamp: p.dateISO || null }));
            // joined opportunities
            (joinedDetails || []).slice().reverse().slice(0,5).forEach(o => {
              const joinedAt = (o.participants && o.participants.length) ? (o.participants.find(p => p.joinedAt)?.joinedAt || o.createdAt) : o.createdAt || null;
              items.push({ type: 'opportunity', title: `Joined ${o.title}`, subtitle: o.ngo_id?.name || o.org || 'Local NGO', timestamp: joinedAt });
            });
            return items.slice(0,5);
          })()} loading={loadingPickups || loadingOpportunities} />

          {/* Nearby opportunities stacked under Recent Activity */}
          <OpportunitiesPanel layout="stack" loading={loadingOpportunities} opportunities={opportunities} wishlist={wishlist} toggleWishlist={toggleWishlist} joinOpportunity={joinOpportunity} leaveOpportunity={leaveOpportunity} joined={joinedOpportunities} />
        </div>

        {/* Right: Wishlist */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Wishlist</h3>
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full">{wishlist.length}</div>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {wishlist.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">💚</div>
                <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">No opportunities saved yet</div>
              </div>
            ) : (
              opportunities
                .filter(op => wishlist.includes(op.id))
                .map(op => (
                  <div key={op.id} className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:shadow-md dark:hover:shadow-slate-900 transition-shadow cursor-pointer bg-slate-50 dark:bg-slate-700">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm truncate">{op.title}</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">{op.org}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{op.date}</div>
                      </div>
                      <button
                        onClick={() => toggleWishlist(op)}
                        className="text-lg hover:scale-110 transition-transform shrink-0"
                        title="Remove from wishlist"
                      >
                        ❤️
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-2 rounded-md shadow-lg animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
};



export default VolunteerDashboard;