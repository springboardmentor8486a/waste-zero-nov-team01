import api from "./axios";

// Admin Dashboard Overview
export const getAdminOverview = async () => {
  try {
    const response = await api.get("/admin/overview");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// User Management
export const getAllAdminUsers = async (params) => {
  try {
    const response = await api.get("/admin/users", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateUserStatus = async (userId, status) => {
  try {
    const response = await api.patch(`/admin/users/${userId}/status`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Opportunity Moderation
export const getAllAdminOpportunities = async (params) => {
  try {
    const response = await api.get("/admin/opportunities", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteAdminOpportunity = async (opportunityId) => {
  try {
    const response = await api.delete(`/admin/opportunities/${opportunityId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Reports & Analytics
export const getAdminReports = async (params) => {
  try {
    const response = await api.get("/admin/reports", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin Logs
export const getAdminLogs = async (params) => {
  try {
    const response = await api.get("/admin/logs", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
