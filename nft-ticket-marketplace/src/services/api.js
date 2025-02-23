import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const eventsApi = {
  getUpcoming: () => api.get("/events/upcoming"),
  validateTicket: (ticketId) => api.post(`/events/validate/${ticketId}`),
};

export const marketplaceApi = {
  listTicket: (data) => api.post("/marketplace/list", data),
  placeBid: (data) => api.post("/marketplace/bid", data),
  purchase: (listingId) => api.post(`/marketplace/purchase/${listingId}`),
};

export const userApi = {
  getTickets: (address) => api.get(`/users/${address}/tickets`),
};

export default api;
