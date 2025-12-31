
import { createContext, useEffect, useState, useContext } from "react";
import api from "../api/axios"; 

export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("wastezero_user");
    const token = localStorage.getItem("wastezero_token");
    if (stored && token) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const register = async (payload) => {
    const res = await api.post("/auth/register", payload); 
    return res.data;
  };

  // LOGIN – real API call
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password }); 
    const data = res.data;
    const cleanUser = {
      id: data.user.id,
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