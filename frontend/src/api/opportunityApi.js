import api from "./axios";

export const getOpportunities = (token) =>
  api.get("/opportunities/my", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createOpportunity = (data, token) =>
  api.post("/opportunities", data, {
    headers: { Authorization: `Bearer ${token}` },
  });