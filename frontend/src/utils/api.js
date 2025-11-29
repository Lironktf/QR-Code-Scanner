import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (email, password) => api.post('/auth/register', { email, password }),
};

// Event APIs
export const eventAPI = {
  getEvents: () => api.get('/events'),
  createEvent: (name) => api.post('/events', { name }),
  deleteEvent: (eventId) => api.delete(`/events/${eventId}`),
  exportEvent: (eventId, format = 'json') => api.get(`/events/${eventId}/export?format=${format}`),
};

// QR Code APIs
export const qrCodeAPI = {
  getQRCodes: (eventId) => api.get(`/events/${eventId}/qrcodes`),
  addQRCode: (eventId, content) => api.post(`/events/${eventId}/qrcodes`, { content }),
  processQRCodes: (eventId) => api.post(`/events/${eventId}/qrcodes/process`),
};

export default api;
