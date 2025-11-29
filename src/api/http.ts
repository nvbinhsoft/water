import axios from 'axios';
import { getAuthToken, clearAuthToken } from '../utils/auth';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
  const auth = getAuthToken();
  if (auth) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `${auth.type} ${auth.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthToken();
    }
    return Promise.reject(error);
  }
);

export default api;
