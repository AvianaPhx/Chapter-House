import axios from 'axios';
import { useAuth } from './AuthContext';

const api = axios.create({
  baseURL: 'https://localhost:7227/api',
  withCredentials: true,
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If 401 Unauthorized, logout the user
      const { logout } = useAuth();
      logout();
    }
    return Promise.reject(error);
  }
);

export default api;