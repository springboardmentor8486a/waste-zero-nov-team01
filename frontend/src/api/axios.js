import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // backend url & /api prefix
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("wastezero_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;