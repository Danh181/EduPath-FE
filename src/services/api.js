import axios from 'axios';

// Base URL của backend API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Tạo axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để tự động thêm token vào headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý lỗi response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Chỉ redirect nếu KHÔNG phải login/register endpoint
      const url = error.config?.url || '';
      const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register');
      
      if (!isAuthEndpoint) {
        // Token hết hạn hoặc invalid - chỉ redirect khi KHÔNG phải trang auth
        console.log('401 Unauthorized - Clearing token and redirecting to login');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else {
        // Đang ở trang login/register - để component xử lý lỗi
        console.log('401 on auth endpoint - letting component handle error');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
