// Axios-based API client
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://promptvault-1tws.onrender.com';

const instance = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('pv_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

instance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const status = err?.response?.status || 500;
    let data = err?.response?.data;
    // If server responded with a Blob (e.g., from a PDF endpoint), try parse to JSON
    if (data instanceof Blob) {
      try {
        const text = await data.text();
        data = JSON.parse(text);
      } catch {
        // keep as Blob if not JSON
      }
    }
    if (!data || typeof data !== 'object') data = { message: 'Request failed' };
    return Promise.reject({ status, data });
  }
);

export const api = {
  setToken(token) {
    if (token) localStorage.setItem('pv_token', token);
    else localStorage.removeItem('pv_token');
  },
  getToken() {
    return localStorage.getItem('pv_token');
  },
  async request(path, { method = 'GET', body, params, headers } = {}) {
    const res = await instance.request({ url: path, method, data: body, params, headers });
    return res.data;
  },
  // Auth
  login(creds) {
    return this.request('/auth/login', { method: 'POST', body: creds });
  },
  register(data) {
    return this.request('/auth/register', { method: 'POST', body: data });
  },
  // Prompts CRUD
  listPrompts(params = {}) {
    return this.request('/prompts', { params });
  },
  getPrompt(id) {
    return this.request(`/prompts/${id}`);
  },
  createPrompt(data) {
    return this.request('/prompts', { method: 'POST', body: data });
  },
  updatePrompt(id, data) {
    return this.request(`/prompts/${id}`, { method: 'PUT', body: data });
  },
  deletePrompt(id) {
    return this.request(`/prompts/${id}`, { method: 'DELETE' });
  },
  // Community
  publishPrompt(id) {
    return this.request(`/community/${id}/publish`, { method: 'POST' });
  },
  unpublishPrompt(id) {
    return this.request(`/community/${id}/unpublish`, { method: 'POST' });
  },
  listPublic(params = {}) {
    return this.request('/community/public', { params });
  },
  likePrompt(id) {
    return this.request(`/community/${id}/like`, { method: 'POST' });
  },
  unlikePrompt(id) {
    return this.request(`/community/${id}/unlike`, { method: 'POST' });
  },
  // Export
  exportJson(ids) {
    return this.request('/export/json', { method: 'POST', body: { ids } });
  },
  exportPdf(ids) {
    // Return raw blob via axios
    return instance.post('/export/pdf', { ids }, { responseType: 'blob' });
  },
  exportNotion(ids) {
    return this.request('/export/notion', { method: 'POST', body: { ids } });
  },
};

export default api;
