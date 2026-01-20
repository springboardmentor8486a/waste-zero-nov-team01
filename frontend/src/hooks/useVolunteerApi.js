import axios from '../api/axios';

const QUEUE_KEY = 'pickup_queue_v1';

// Try real API; fall back to simulated delay for demo
async function completePickupApi(id) {
  try {
    if (!navigator.onLine) throw new Error('offline');
    // Replace with real endpoint when available
    const res = await axios.post(`/pickups/${id}/complete`);
    return res.data;
  } catch (e) {
    // Propagate the error so the UI can decide how to handle it (enqueue, show error, etc.)
    throw e;
  }
}

export async function completePickup(id) {
  return completePickupApi(id);
}

export async function getMyPickups() {
  try {
    const res = await axios.get('/pickups');
    return res.data;
  } catch (e) {
    // fallback: return []
    return [];
  }
}

export async function getDashboardSummary() {
  try {
    const res = await axios.get('/pickups/dashboard/summary');
    return res.data;
  } catch (e) {
    return null;
  }
}

export async function getOpportunities() {
  try {
    const res = await axios.get('/opportunities');
    return res.data || [];
  } catch (e) {
    return [];
  }
}

export async function joinOpportunityApi(opportunityId) {
  try {
    const res = await axios.post(`/opportunities/${opportunityId}/join`);
    return res.data;
  } catch (e) {
    // return error object upward
    throw e;
  }
}

export async function leaveOpportunityApi(opportunityId) {
  try {
    const res = await axios.delete(`/opportunities/${opportunityId}/join`);
    return res.data;
  } catch (e) {
    throw e;
  }
}

export async function getMyJoined() {
  try {
    const res = await axios.get('/users/me/joined');
    return res.data?.joined || [];
  } catch (e) {
    return [];
  }
}

export async function getMyConversations() {
  try {
    const res = await axios.get('/messages/conversations');
    return res.data || [];
  } catch (e) {
    return [];
  }
}

export async function getMyProfile() {
  try {
    const res = await axios.get('/users/me');
    return res.data || null;
  } catch (e) {
    return null;
  }
}

export function enqueuePickupComplete(id) {
  try {
    const raw = localStorage.getItem(QUEUE_KEY) || '[]';
    const q = JSON.parse(raw);
    q.push({ id, ts: Date.now() });
    localStorage.setItem(QUEUE_KEY, JSON.stringify(q));
    return q.length;
  } catch (e) {
    return 0;
  }
}

export function getQueuedCount() {
  try {
    const raw = localStorage.getItem(QUEUE_KEY) || '[]';
    const q = JSON.parse(raw);
    return q.length;
  } catch (e) {
    return 0;
  }
}

export async function processQueue(onItemProcessed) {
  try {
    const raw = localStorage.getItem(QUEUE_KEY) || '[]';
    let q = JSON.parse(raw);
    const remaining = [];
    for (const item of q) {
      try {
        await completePickupApi(item.id);
        if (onItemProcessed) onItemProcessed(item.id);
      } catch (err) {
        // If any item fails, keep it in the queue
        remaining.push(item);
      }
    }
    localStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
    return remaining.length;
  } catch (e) {
    return -1;
  }
}

export async function getWishlist() {
  try {
    const res = await axios.get('/users/me/wishlist');
    return res.data?.wishlist || [];
  } catch (e) {
    return [];
  }
}

export async function addToWishlistApi(opportunityId) {
  try {
    const res = await axios.post('/users/me/wishlist', { opportunityId });
    return res.data;
  } catch (e) {
    return null;
  }
}

export async function removeFromWishlistApi(opportunityId) {
  try {
    const res = await axios.delete(`/users/me/wishlist/${opportunityId}`);
    return res.data;
  } catch (e) {
    return null;
  }
}

export default {
  completePickup,
  getMyPickups,
  getDashboardSummary,
  getWishlist,
  addToWishlistApi,
  removeFromWishlistApi,
  enqueuePickupComplete,
  getQueuedCount,
  processQueue,
  getOpportunities,
  joinOpportunityApi,
  leaveOpportunityApi,
  getMyJoined,
  getMyConversations,
  getMyProfile
};