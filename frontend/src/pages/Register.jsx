import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', password2: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.password2) return setError('Пароли не совпадают');
    if (form.password.length < 6) return setError('Пароль минимум 6 символов');

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Регистрация</h2>
        <input name="name" placeholder="Имя пользователя"
          value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email"
          value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Пароль"
          value={form.password} onChange={handleChange} required />
        <input name="password2" type="password" placeholder="Повторите пароль"
          value={form.password2} onChange={handleChange} required />
        {error && <p className="auth-error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Загрузка...' : 'Зарегистрироваться'}
        </button>
        <p>Уже есть аккаунт? <Link to="/login">Войти</Link></p>
      </form>
    </div>
  );
}