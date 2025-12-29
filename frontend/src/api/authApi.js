import api from "./axios";

// REGISTER
export const register = (data) => api.post("/auth/register", data);

// LOGIN
export const login = (data) => api.post("/auth/login", data);

// CHANGE PASSWORD (protected)
export const changePassword = (data) =>
  api.post("/auth/change-password", data);

// GET CURRENT USER (protected)
export const getMe = () => api.get("/auth/me");

// UPDATE PROFILE (protected)
export const updateProfile = (data) =>
  api.put("/users/me", data);