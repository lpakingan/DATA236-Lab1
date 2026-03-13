// src/api/api.js
// ─── Central Axios instance + all API helpers ───────────────

import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// ── Attach JWT on every request ──────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Global response error handler ────────────────────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ═══════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════
export const authAPI = {
  signup:       (data)  => api.post('/auth/signup', data),
  login:        (data)  => api.post('/auth/login', data),
  logout:       ()      => api.post('/auth/logout'),
  ownerSignup:  (data)  => api.post('/auth/owner/signup', data),
  ownerLogin:   (data)  => api.post('/auth/owner/login', data),
  me:           ()      => api.get('/auth/me'),
};

// ═══════════════════════════════════════════════════════════
// USERS / PROFILE
// ═══════════════════════════════════════════════════════════
export const userAPI = {
  getProfile:        ()       => api.get('/users/profile'),
  updateProfile:     (data)   => api.put('/users/profile', data),
  uploadAvatar:      (form)   => api.post('/users/profile/avatar', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getPreferences:    ()       => api.get('/users/preferences'),
  updatePreferences: (data)   => api.put('/users/preferences', data),
  getFavorites:      ()       => api.get('/users/favorites'),
  addFavorite:       (id)     => api.post(`/users/favorites/${id}`),
  removeFavorite:    (id)     => api.delete(`/users/favorites/${id}`),
  getHistory:        ()       => api.get('/users/history'),
};

// ═══════════════════════════════════════════════════════════
// RESTAURANTS
// ═══════════════════════════════════════════════════════════
export const restaurantAPI = {
  list:     (params) => api.get('/restaurants', { params }),
  get:      (id)     => api.get(`/restaurants/${id}`),
  create:   (form)   => api.post('/restaurants', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update:   (id, form) => api.put(`/restaurants/${id}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete:   (id)     => api.delete(`/restaurants/${id}`),
  search:   (q)      => api.get('/restaurants/search', { params: { q } }),
  claim:    (id)     => api.post(`/restaurants/${id}/claim`),
};

// ═══════════════════════════════════════════════════════════
// REVIEWS
// ═══════════════════════════════════════════════════════════
export const reviewAPI = {
  list:   (restaurantId)        => api.get(`/restaurants/${restaurantId}/reviews`),
  create: (restaurantId, data)  => api.post(`/restaurants/${restaurantId}/reviews`, data),
  update: (reviewId, data)      => api.put(`/reviews/${reviewId}`, data),
  delete: (reviewId)            => api.delete(`/reviews/${reviewId}`),
};

// ═══════════════════════════════════════════════════════════
// AI ASSISTANT
// ═══════════════════════════════════════════════════════════
export const aiAPI = {
  chat: (data) => api.post('/ai-assistant/chat', data),
};

// ═══════════════════════════════════════════════════════════
// OWNER
// ═══════════════════════════════════════════════════════════
export const ownerAPI = {
  getDashboard:    ()       => api.get('/owner/dashboard'),
  getRestaurants:  ()       => api.get('/owner/restaurants'),
  getReviews:      (id)     => api.get(`/owner/restaurants/${id}/reviews`),
};

export default api;
