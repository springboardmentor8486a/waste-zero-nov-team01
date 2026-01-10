// src/context/AuthContext.jsx
import { createContext, useEffect, useState, useContext } from "react";
import api from "../api/axios"; // baseURL = http://localhost:5000/api

export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { id, email, role }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("wastezero_user");
    const token = localStorage.getItem("wastezero_token");
    if (stored && token) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  // REGISTER – just call API and return data; redirect outside
  const register = async (payload) => {
    const res = await api.post("/auth/register", payload); // POST /api/auth/register
    return res.data; // { message, user?, token? } depends on backend
  };

  // LOGIN – real API call
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password }); // POST /api/auth/login
    const data = res.data; // expect { user, token }

    const cleanUser = {
      id: data.user._id || data.user.id,
      email: data.user.email,
      role: data.user.role,
    };

    setUser(cleanUser);
    localStorage.setItem("wastezero_user", JSON.stringify(cleanUser));
    localStorage.setItem("wastezero_token", data.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("wastezero_user");
    localStorage.removeItem("wastezero_token");
  };

  const value = { user, loading, register, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};