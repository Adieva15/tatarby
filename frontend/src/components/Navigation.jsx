import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/navigation.css';

const NAV_ITEMS = [
  { path: '/home', label: 'Главная' },
  { path: '/read', label: 'Чтение' },
  { path: '/cards', label: 'Карточки' },
  { path: '/questions', label: 'Вопросы' },
  { path: '/essay', label: 'Сочинение' },
];

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="nav-header">
      {/* Орнамент слева */}
      <div className="nav-ornament nav-ornament-left" aria-hidden="true" />

      <div className="nav-container">
        {/* Логотип */}
        <button className="nav-logo" onClick={() => navigate('/home')}>
          <span className="nav-logo-mark" aria-hidden="true" />
          <span className="nav-logo-text">Нур</span>
        </button>

        {/* Меню */}
        <nav className="nav-menu">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Профиль + Выйти */}
        <div className="nav-actions">
          <button className="nav-profile" onClick={() => navigate('/profile')}>
            <span className="nav-profile-avatar">
              {(user?.username || user?.email || '?')[0].toUpperCase()}
            </span>
            <span className="nav-profile-name">
              {user?.username || user?.email}
            </span>
          </button>
          <button className="nav-logout" onClick={handleLogout}>
            Выйти
          </button>
        </div>
      </div>

      {/* Орнамент справа */}
      <div className="nav-ornament nav-ornament-right" aria-hidden="true" />
    </header>
  );
}