import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/auth.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-form">
        <h2>Личный кабинет</h2>
        <p>Привет, <b>{user?.username || user?.email}</b>!</p>
        <Link to="/home" style={{
          padding: '12px',
          background: '#667eea',
          color: '#fff',
          textAlign: 'center',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 600,
          marginBottom: '8px'
        }}>
          🏠 На главную
        </Link>
        <button onClick={handleLogout}>Выйти</button>
      </div>
    </div>
  );
}