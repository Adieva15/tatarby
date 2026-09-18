import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
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
        <button onClick={handleLogout}>Выйти</button>
      </div>
    </div>
  );
}