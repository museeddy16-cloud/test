// API Configuration - supports both development and production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
};

export default apiConfig;
