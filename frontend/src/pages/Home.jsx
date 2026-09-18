import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { demoUserStats, getLevel } from '../data/demoStats';
import '../styles/home.css';

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const level = getLevel(demoUserStats.total_xp);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="home-logo">Tatarby</div>
        <nav className="home-nav">
          <button
            className="home-profile-btn"
            onClick={() => navigate('/profile')}
          >
            <span className="home-profile-avatar">
              {(user?.username || user?.email || '?')[0].toUpperCase()}
            </span>
            <span className="home-profile-name">
              {user?.username || user?.email}
            </span>
          </button>
          <button className="home-btn-logout" onClick={handleLogout}>Выйти</button>
        </nav>
      </header>

      <main className="home-main">
        <section className="home-hero">
          <h1>С возвращением, {user?.username || 'гость'}</h1>
          <p>Продолжай учиться — ты на верном пути</p>
          <div className="home-hero-buttons">
            <button className="home-btn-primary" onClick={() => navigate('/dashboard')}>
              Продолжить обучение
            </button>
            <button className="home-btn-secondary" onClick={() => navigate('/profile')}>
              Мой профиль
            </button>
          </div>
        </section>

        <section className="home-quick-stats">
          <div className="quick-stat" onClick={() => navigate('/profile')}>
            <div className="quick-stat-value">{demoUserStats.current_streak}</div>
            <div className="quick-stat-label">Дней подряд</div>
          </div>
          <div className="quick-stat" onClick={() => navigate('/profile')}>
            <div className="quick-stat-value">{demoUserStats.total_xp.toLocaleString('ru-RU')}</div>
            <div className="quick-stat-label">XP</div>
          </div>
          <div className="quick-stat" onClick={() => navigate('/profile')}>
            <div className="quick-stat-value">{level}</div>
            <div className="quick-stat-label">Уровень</div>
          </div>
          <div className="quick-stat" onClick={() => navigate('/profile')}>
            <div className="quick-stat-value">{demoUserStats.total_words_learned}</div>
            <div className="quick-stat-label">Слов</div>
          </div>
        </section>

        <section className="home-features">
          <div className="home-card" onClick={() => navigate('/profile')}>
            <h3>Профиль</h3>
            <p>Стрик, XP, аналитика и график активности за год</p>
          </div>
          <div className="home-card" onClick={() => navigate('/dashboard')}>
            <h3>Уроки</h3>
            <p>Продолжить обучение с того места, где остановился</p>
          </div>
          <div className="home-card">
            <h3>Ежедневная цель</h3>
            <p>Выполни 3 урока сегодня, чтобы продлить стрик</p>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <p>© 2026 Tatarby</p>
      </footer>
    </div>
  );
}