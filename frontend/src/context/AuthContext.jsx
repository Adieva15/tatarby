import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';

const AuthContext = createContext(null);

// ⚙️ ДЕМО-РЕЖИМ: работает без бэкенда
const DEMO_MODE = true;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('demoUser');
    if (!token) {
      setLoading(false);
      return;
    }
    if (DEMO_MODE && savedUser) {
      setUser(JSON.parse(savedUser));
      setLoading(false);
      return;
    }
    api.get('/user/me')
      .then(({ data }) => setUser(data))
      .catch(() => localStorage.clear())
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    if (DEMO_MODE) {
      await new Promise((r) => setTimeout(r, 500));
      const demoUser = {
        id: 1,
        username: email.split('@')[0] || 'user',
        email,
      };
      localStorage.setItem('accessToken', 'demo-access-token');
      localStorage.setItem('refreshToken', 'demo-refresh-token');
      localStorage.setItem('demoUser', JSON.stringify(demoUser));
      setUser(demoUser);
      return { user: demoUser, accessToken: 'demo-access-token' };
    }
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    setUser(data.user);
    return data;
  };

  const register = async (username, email, password) => {
    if (DEMO_MODE) {
      await new Promise((r) => setTimeout(r, 500));
      const demoUser = { id: Date.now(), username, email };
      localStorage.setItem('accessToken', 'demo-access-token');
      localStorage.setItem('refreshToken', 'demo-refresh-token');
      localStorage.setItem('demoUser', JSON.stringify(demoUser));
      setUser(demoUser);
      return { user: demoUser, accessToken: 'demo-access-token' };
    }
    const { data } = await api.post('/auth/register', { username, email, password });
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      setUser(data.user);
    }
    return data;
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);