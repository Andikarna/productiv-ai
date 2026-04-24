import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('productiveai_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally — redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('productiveai_token');
      localStorage.removeItem('productiveai_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updatePreferences: (preferences) => api.patch('/auth/preferences', { preferences }),
};

// ── Chat ──────────────────────────────────────────────────
export const chatAPI = {
  sendMessage: (message, image = null) => api.post('/chat', { message, image }),
  getHistory: (page = 1, limit = 50) => api.get(`/chat/history?page=${page}&limit=${limit}`),
  clearHistory: () => api.delete('/chat/history'),
};

// ── Tasks ─────────────────────────────────────────────────
export const taskAPI = {
  create: (data) => api.post('/task', data),
  createNL: (title) => api.post('/task', { title, naturalLanguage: true }),
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`/task${params ? `?${params}` : ''}`);
  },
  update: (id, data) => api.patch(`/task/${id}`, data),
  delete: (id) => api.delete(`/task/${id}`),
};

export default api;
