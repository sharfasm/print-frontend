import axios from 'axios';
import { API_URL } from './env';

const api = axios.create({
  baseURL: API_URL,
});

// Attach access token logic
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Drop a stale/expired token on 401 so it isn't reused on later requests.
// Auth UI state is reconciled by AuthContext; we intentionally do NOT redirect
// or reload here, to avoid changing the existing UX. Login/register 401s
// (wrong credentials) are excluded. The error is re-thrown so all existing
// catch blocks behave exactly as before.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error?.response?.status === 401) {
      const url = error.config?.url || '';
      const isAuthAttempt = url.includes('/auth/login') || url.includes('/auth/register');
      if (!isAuthAttempt) {
        localStorage.removeItem('token');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
