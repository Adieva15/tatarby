import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import StatsPanel from '../components/StatsPanel';
import ActivityHeatmap from '../components/ActivityHeatmap';
import XpChart from '../components/XpChart';
import Analytics from '../components/Analytics';
import Achievements from '../components/Achievements';
import Navigation from '../components/Navigation';
import '../styles/profile.css';
import '../styles/stats.css';

export default function Profile() {
  const { user, profile, level, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="profile-page">
        <Navigation />
        <div className="profile-loading">Загрузка профиля...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-page">
        <Navigation />
        <div className="profile-loading">Нет данных</div>
      </div>
    );
  }

  // Данные из API
  const stats = {
    current_streak: profile.current_streak,
    longest_streak: profile.longest_streak,
    total_xp: profile.total_xp,
    total_lessons: profile.total_lessons,
    total_words_learned: profile.total_words,
    level: profile.level,
    xp_to_next_level: profile.xp_to_next_level,
    activity: profile.activity,   // 365 дней
  };

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
              <span>Уровень {profile.level}</span>
              <span>·</span>
              <span>{profile.total_xp.toLocaleString('ru-RU')} XP</span>
              {level?.language_level && (
                <>
                  <span>·</span>
                  <span>Язык: {level.language_level}</span>
                </>
              )}
            </div>
          </div>
        </section>

        <StatsPanel stats={stats} />
        <XpChart activity={stats.activity} />
        <ActivityHeatmap activity={stats.activity} />
        <Analytics stats={stats} activity={stats.activity} />
        <Achievements stats={stats} />
      </main>

      <footer className="home-footer">
        <p className="home-footer-text">
          Нур — <em>свет знаний</em> на твоём пути
        </p>
      </footer>
    </div>
  );
}