// src/context/AuthContext.jsx - UPDATED WITH ADMIN SUPPORT ✅
import { createContext, useEffect, useState, useContext } from "react";
import api from "../api/axios"; // baseURL = http://localhost:5000/api

export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { id, email, role, name, location }
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('online'); // 'online' | 'offline' | 'checking'

  useEffect(() => {
    const stored = localStorage.getItem("wastezero_user");
    const token = localStorage.getItem("wastezero_token");
    
    if (stored && token) {
      const parsed = JSON.parse(stored);
      
      // Always restore user from localStorage immediately (offline-first approach)
      setUser(parsed);
      setConnectionStatus('checking');
      
      // Then validate token with server to ensure session is still valid
      api
        .get("/users/me", {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => {
          const full = res.data || {};
          const refreshed = {
            id: full._id || full.id,
            email: full.email,
            role: full.role,
            name: full.name,
            location: full.location,
            isActive: full.isActive || true
          };
          setUser(refreshed);
          localStorage.setItem("wastezero_user", JSON.stringify(refreshed));
          // ✅ Set axios auth header if token is valid
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setConnectionStatus('online');
        })
        .catch((err) => {
          // Token validation failed, but keep user logged in locally
          // Only clear if it's a 401 (unauthorized) error
          if (err?.response?.status === 401) {
            localStorage.removeItem("wastezero_user");
            localStorage.removeItem("wastezero_token");
            delete api.defaults.headers.common['Authorization'];
            setUser(null);
            setConnectionStatus('offline');
          } else {
            // Network error or server error - keep user session but show offline status
            setConnectionStatus('offline');
            console.warn('Connection check failed, but keeping user session intact:', err?.message);
          }
        });
    }
    setLoading(false);
  }, []);

  // REGISTER – just call API and return data; redirect outside
  const register = async (payload) => {
    const res = await api.post("/auth/register", payload);
    return res.data; // { message, user?, token? }
  };

  // LOGIN – real API call with proper token handling
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const data = res.data; // expect { user, token }

    const cleanUser = {
      id: data.user._id || data.user.id,
      email: data.user.email,
      role: data.user.role,           // ✅ Admin role support
      name: data.user.name,
      location: data.user.location,
      isActive: data.user.isActive !== false  // ✅ Status support
    };

    // ✅ Set both token AND user in localStorage
    localStorage.setItem("wastezero_user", JSON.stringify(cleanUser));
    localStorage.setItem("wastezero_token", data.token);
    
    // ✅ Update API axios defaults with token
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    
    setUser(cleanUser);
    setConnectionStatus('online');
  }; 

  const logout = () => {
    setUser(null);
    localStorage.removeItem("wastezero_user");
    localStorage.removeItem("wastezero_token");
    // ✅ Clear axios auth header
    delete api.defaults.headers.common['Authorization'];
    setConnectionStatus('offline');
  };

  // ✅ ADMIN CHECK - Critical for RBAC
  const isAdmin = user?.role?.toLowerCase() === 'admin';
  const isAuthenticated = !!user && user.isActive !== false;

  const value = { 
    user, 
    loading, 
    register, 
    login, 
    logout,
    isAdmin,           // ✅ Export for AdminRoute guard
    isAuthenticated,
    connectionStatus   // ✅ Export connection status
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
