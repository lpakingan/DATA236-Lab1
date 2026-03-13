import axios from "axios";

const BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

const api = axios.create({ baseURL: BASE, headers: { "Content-Type": "application/json" } });

api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem("token");
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login:       (d) => api.post("/auth/login", d),
  signup:      (d) => api.post("/auth/signup", d),
  logout:      ()  => api.post("/auth/logout"),
  ownerLogin:  (d) => api.post("/auth/owner/login", d),
  ownerSignup: (d) => api.post("/auth/owner/signup", d),
};

export const userAPI = {
  getProfile:     ()    => api.get("/users/profile"),
  updateProfile:  (d)   => api.put("/users/profile", d),
  uploadAvatar:   (f)   => api.post("/users/profile/avatar", f, { headers: { "Content-Type": "multipart/form-data" } }),
  getPreferences: ()    => api.get("/users/preferences"),
  savePreferences:(d)   => api.put("/users/preferences", d),
  getFavorites:   ()    => api.get("/users/favorites"),
  addFavorite:    (id)  => api.post(`/users/favorites/${id}`),
  removeFavorite: (id)  => api.delete(`/users/favorites/${id}`),
  getHistory:     ()    => api.get("/users/history"),
};

export const restaurantAPI = {
  list:   (p)      => api.get("/restaurants", { params: p }),
  get:    (id)     => api.get(`/restaurants/${id}`),
  create: (f)      => api.post("/restaurants", f, { headers: { "Content-Type": "multipart/form-data" } }),
  update: (id, f)  => api.put(`/restaurants/${id}`, f, { headers: { "Content-Type": "multipart/form-data" } }),
  delete: (id)     => api.delete(`/restaurants/${id}`),
  claim:  (id)     => api.post(`/restaurants/${id}/claim`),
};

export const reviewAPI = {
  list:   (rid)       => api.get(`/restaurants/${rid}/reviews`),
  create: (rid, d)    => api.post(`/restaurants/${rid}/reviews`, d),
  update: (id, d)     => api.put(`/reviews/${id}`, d),
  delete: (id)        => api.delete(`/reviews/${id}`),
};

export const aiAPI = {
  chat: (d) => api.post("/ai-assistant/chat", d),
};

export const ownerAPI = {
  getDashboard:   ()    => api.get("/owner/dashboard"),
  getRestaurants: ()    => api.get("/owner/restaurants"),
  getReviews:     (id)  => api.get(`/owner/restaurants/${id}/reviews`),
};

export default api;
