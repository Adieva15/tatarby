import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="home-logo">Tatarby</div>
        <nav className="home-nav">
          <span className="home-user">👤 {user?.username || user?.email}</span>
          <button className="home-btn-logout" onClick={handleLogout}>Выйти</button>
        </nav>
      </header>

      <main className="home-main">
        <section className="home-hero">
          <h1>Добро пожаловать, {user?.username || 'гость'}! 🎉</h1>
          <p>Вы успешно авторизованы в системе Tatarby</p>
          <button className="home-btn-primary" onClick={() => navigate('/dashboard')}>
            Перейти в личный кабинет
          </button>
        </section>

        <section className="home-features">
          <div className="home-card">
            <div className="home-card-icon">🔐</div>
            <h3>JWT-аутентификация</h3>
            <p>Access-токен + Refresh-токен для безопасного входа</p>
          </div>
          <div className="home-card">
            <div className="home-card-icon">⚛️</div>
            <h3>React + Vite</h3>
            <p>Современный фронтенд с быстрой горячей перезагрузкой</p>
          </div>
          <div className="home-card">
            <div className="home-card-icon">🎨</div>
            <h3>Адаптивный дизайн</h3>
            <p>Работает на любых устройствах — от телефона до ПК</p>
          </div>
        </section>

        <section className="home-footer-section">
          <h2>Что дальше?</h2>
          <ul>
            <li>✅ Настроить бэкенд для реальной аутентификации</li>
            <li>✅ Добавить защищённые маршруты</li>
            <li>✅ Развернуть на хостинге (Vercel, Netlify)</li>
          </ul>
        </section>
      </main>

      <footer className="home-footer">
        <p>© 2026 Tatarby. Демонстрационная страница.</p>
      </footer>
    </div>
  );
}