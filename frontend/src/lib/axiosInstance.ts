import axios from 'axios';
import { ACCESS_TOKEN_KEY } from '@/features/authentication/utils/constants'; 

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/v1/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Adds Auth Token
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (
        token &&
        config.headers &&
        !config.url?.endsWith('/signin') &&
        !config.url?.endsWith('/signup') && 
        !config.url?.endsWith('/refresh-token')
      ) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // const originalRequest = error.config; // For token refresh logic
    if (error.response && error.response.status === 401) {
      // console.error('AXIOS INTERCEPTOR: Unauthorized access (401). Dispatching sessionExpired event.');
      if (typeof window !== 'undefined') {
        // Dispatch a custom event that AuthProvider can listen to trigger logout
        window.dispatchEvent(new CustomEvent('sessionExpired'));
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;