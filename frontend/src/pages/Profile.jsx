import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import StatsPanel from '../components/StatsPanel';
import ActivityHeatmap from '../components/ActivityHeatmap';
import XpChart from '../components/XpChart';
import Analytics from '../components/Analytics';
import Achievements from '../components/Achievements';
import '../styles/home.css';
import '../styles/stats.css';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="home-logo" onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>
          Tatarby
        </div>
        <nav className="home-nav">
          <button className="home-btn-back" onClick={() => navigate('/home')}>
            На главную
          </button>
          <button className="home-btn-logout" onClick={handleLogout}>Выйти</button>
        </nav>
      </header>

      <main className="home-main">
        <section className="profile-header">
          <div className="profile-avatar">
            {(user?.username || user?.email || '?')[0].toUpperCase()}
          </div>
          <div className="profile-info">
            <h1>{user?.username || 'Пользователь'}</h1>
            <p>{user?.email}</p>
          </div>
        </section>

        <StatsPanel />
        <XpChart />
        <ActivityHeatmap />
        <Analytics />
        <Achievements />
      </main>

      <footer className="home-footer">
        <p>© 2026 Tatarby. Профиль пользователя.</p>
      </footer>
    </div>
  );
}