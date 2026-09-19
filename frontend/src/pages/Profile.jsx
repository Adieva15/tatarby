import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import StatsPanel from '../components/StatsPanel';
import ActivityHeatmap from '../components/ActivityHeatmap';
import XpChart from '../components/XpChart';
import Analytics from '../components/Analytics';
import Achievements from '../components/Achievements';
import Navigation from '../components/Navigation';
import { demoUserStats, getLevel } from '../data/demoStats';
import '../styles/profile.css';
import '../styles/stats.css';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const level = getLevel(demoUserStats.total_xp);

  return (
    <div className="profile-page">
      <Navigation />

      <main className="profile-main">
        <section className="profile-header">
          <div className="profile-avatar">
            {(user?.username || user?.email || '?')[0].toUpperCase()}
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{user?.username || 'Пользователь'}</h1>
            <p className="profile-email">{user?.email}</p>
            <div className="profile-meta">
              <span>Уровень {level}</span>
              <span>·</span>
              <span>{demoUserStats.total_xp.toLocaleString('ru-RU')} XP</span>
              <span>·</span>
              <span>С нами с {new Date(demoUserStats.member_since).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
        </section>

        <StatsPanel />
        <XpChart />
        <ActivityHeatmap />
        <Analytics />
        <Achievements />
      </main>

      <footer className="home-footer">
        <p className="home-footer-text">
          Нур — <em>свет знаний</em> на твоём пути
        </p>
      </footer>
    </div>
  );
}