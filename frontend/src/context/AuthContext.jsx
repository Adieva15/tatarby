import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Загрузка профиля при старте
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/api/me/profile")
      .then(({ data }) => {
        setUser({
          username: data.name || "Пользователь",
          email: data.email,
          ...data,
        });
      })
      .catch(() => localStorage.removeItem("access_token"))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/api/login", { email, password });
    localStorage.setItem("access_token", data.access_token);

    // Загружаем профиль
    const profile = await api.get("/api/me/profile");
    setUser({
      username: profile.data.name || "Пользователь",
      email,
      ...profile.data,
    });
    return profile.data;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post("/api/register", { name, email, password });
    // После регистрации сразу логиним
    return login(email, password);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {
      // ignore
    }
    localStorage.removeItem("access_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
