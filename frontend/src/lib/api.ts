import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Check if we're in demo mode (no backend available)
const isDemoMode = !import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // 5 second timeout
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // In demo mode, don't redirect on 401 if backend is unavailable
    if (!isDemoMode && error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
export { isDemoMode };

// API Methods
export const auth = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: any) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
};

export const leads = {
  getAll: (params?: any) => api.get('/leads', { params }),
  getById: (id: string) => api.get(`/leads/${id}`),
  create: (data: any) => api.post('/leads', data),
  update: (id: string, data: any) => api.patch(`/leads/${id}`, data),
  updateStatus: (id: string, status: string) =>
    api.patch(`/leads/${id}/status`, { status }),
  assign: (id: string, userId: string) =>
    api.post(`/leads/${id}/assign`, { userId }),
  enrich: (id: string) => api.post(`/enrichment/${id}`),
  getChecklist: (id: string) => api.get(`/leads/${id}/checklist`),
  updateChecklistItem: (leadId: string, itemId: string, completed: boolean) =>
    api.patch(`/leads/${leadId}/checklist/${itemId}`, { completed }),
};

export const users = {
  getAll: () => api.get('/users'),
  getById: (id: string) => api.get(`/users/${id}`),
};

export const documents = {
  upload: (leadId: string, file: File, category: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    return api.post(`/documents/${leadId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getByLead: (leadId: string) => api.get(`/documents/${leadId}`),
  delete: (id: string) => api.delete(`/documents/${id}`),
};

export const analytics = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getTimeline: (period: string = '30d') =>
    api.get('/analytics/timeline', { params: { period } }),
};

// Demo mode API wrapper
const wrapWithDemo = <T extends (...args: any[]) => Promise<any>>(
  apiCall: T,
  demoData: any
): T => {
  return (async (...args: any[]) => {
    if (isDemoMode) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return { data: typeof demoData === 'function' ? demoData(...args) : demoData };
    }
    return apiCall(...args);
  }) as T;
};

// Import mock data
import { mockDashboardStats, mockLeads, mockUsers, mockLeadDetails } from './mockData';

// Combined API export with demo mode support
export const apiMethods = {
  auth,
  leads: {
    ...leads,
    getAll: wrapWithDemo(leads.getAll, mockLeads),
    getById: wrapWithDemo(leads.getById, mockLeadDetails),
  },
  users: {
    ...users,
    getAll: wrapWithDemo(users.getAll, mockUsers),
  },
  documents,
  analytics: {
    ...analytics,
    getDashboard: wrapWithDemo(analytics.getDashboard, mockDashboardStats),
  },
};

export { wrapWithDemo };
