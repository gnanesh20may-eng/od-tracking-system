import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * API Service Layer
 * All backend API calls are centralized here
 */

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Authentication APIs
 */
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password, role, department) =>
    api.post('/auth/register', { name, email, password, role, department }),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (name, department) => api.put('/auth/profile', { name, department }),
};

/**
 * Duty Management APIs
 */
export const dutyAPI = {
  createDuty: (staffId, dutyDate, startTime, endTime, latitude, longitude, radius) =>
    api.post('/duties', {
      staffId,
      dutyDate,
      startTime,
      endTime,
      latitude,
      longitude,
      radius,
    }),
  getAllDuties: (limit, offset) => api.get('/duties/all', { params: { limit, offset } }),
  getStaffDuties: (staffId) => api.get(`/duties/staff/${staffId || ''}`),
  getDutyById: (dutyId) => api.get(`/duties/${dutyId}`),
  getDutyByToken: (token) => api.get(`/duties/track/${token}`),
  startDutyTracking: (dutyId) => api.post(`/duties/${dutyId}/start`),
  completeDuty: (dutyId) => api.post(`/duties/${dutyId}/complete`),
  updateDuty: (dutyId, data) => api.put(`/duties/${dutyId}`, data),
  deleteDuty: (dutyId) => api.delete(`/duties/${dutyId}`),
  getDutyStatistics: (startDate, endDate) =>
    api.get('/duties/statistics', { params: { startDate, endDate } }),
};

/**
 * Location Tracking APIs
 */
export const locationAPI = {
  logLocation: (dutyId, latitude, longitude, accuracy) =>
    api.post(`/locations/log/${dutyId}`, { latitude, longitude, accuracy }),
  getLocationLogs: (dutyId, limit, offset) =>
    api.get(`/locations/${dutyId}`, { params: { limit, offset } }),
  getLatestLocation: (dutyId) => api.get(`/locations/${dutyId}/latest`),
  getLocationStatistics: (dutyId) => api.get(`/locations/${dutyId}/statistics`),
  getLocationsByTimeRange: (dutyId, startTime, endTime) =>
    api.get(`/locations/${dutyId}/range`, { params: { startTime, endTime } }),
  getLiveLocationData: (date) => api.get('/locations/live/all', { params: { date } }),
};

/**
 * Dashboard/Admin APIs
 */
export const dashboardAPI = {
  getAllStaff: () => api.get('/dashboard/staff'),
  getStaffByRole: (role) => api.get(`/dashboard/staff/role/${role}`),
  getStaffDetails: (staffId) => api.get(`/dashboard/staff/${staffId}`),
  deleteStaff: (staffId) => api.delete(`/dashboard/staff/${staffId}`),
};

export default api;
