import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import Navigation from '../components/Navigation';
import '../styles/learn.css';

export default function LevelTest() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/level-test/questions')
      .then(({ data }) => setQuestions(data))
      .catch((err) => setError(err.response?.data?.detail || 'Ошибка загрузки'))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (qid, letter) => {
    setAnswers({ ...answers, [String(qid)]: letter });
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      return setError('Ответьте на все вопросы');
    }
    try {
      const { data } = await api.post('/api/level-test/submit', { answers });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка');
    }
  };

  if (loading) {
    return (
      <div className="learn-page">
        <Navigation />
        <p style={{ padding: 40 }}>Загрузка...</p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="learn-page">
        <Navigation />
        <div className="learn-result">
          <h1>Тест завершён</h1>
          <div className="result-score">{result.correct} / {result.total}</div>
          <p className="result-text">Уровень: {result.level}</p>
          <p className="result-text">{result.message}</p>
          <div className="result-actions">
            <button className="learn-btn-primary" onClick={() => navigate('/profile')}>
              В профиль
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="learn-page">
      <Navigation />
      <div className="read-container">
        <h1 style={{ fontFamily: 'Playfair Display, serif', marginBottom: 24 }}>
          Тест уровня языка
        </h1>
        {error && <p className="auth-error">{error}</p>}
        {questions.map((q, i) => (
          <div key={q.id} style={{ marginBottom: 32 }}>
            <p style={{ fontWeight: 600, marginBottom: 12 }}>
              {i + 1}. {q.text}
            </p>
            {['a', 'b', 'c', 'd'].map((letter) => (
              <button
                key={letter}
                className={`question-option ${answers[String(q.id)] === letter ? 'option-selected' : ''}`}
                onClick={() => handleSelect(q.id, letter)}
                style={{ display: 'block', width: '100%', marginBottom: 8 }}
              >
                {q[`option_${letter}`]}
              </button>
            ))}
          </div>
        ))}
        <button className="learn-btn-primary" onClick={handleSubmit}>
          Отправить ответы
        </button>
      </div>
    </div>
  );
}