import axios from 'axios';

const api = axios.create({
  baseURL: 'http://backend:8000',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,   // ← ОБЯЗАТЕЛЬНО для refresh-куки
});

// Автоподстановка access-токена
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Автообновление токена при 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const { data } = await axios.post(
          'http://backend:8000/auth/refresh',
          {},
          { withCredentials: true }
        );
        localStorage.setItem('access_token', data.access_token);
        original.headers.Authorization = `Bearer ${data.access_token}`;
        return api(original);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;