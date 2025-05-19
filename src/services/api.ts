
axios.defaults.headers.common['Cache-Control'] = 'no-cache, no-store';
axios.defaults.headers.common['Pragma'] = 'no-cache';

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;