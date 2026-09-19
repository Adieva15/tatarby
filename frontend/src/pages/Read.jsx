import { useNavigate } from 'react-router-dom';
import { demoReadingText } from '../data/demoStats';
import '../styles/learn.css';

export default function Read() {
  const navigate = useNavigate();

  return (
    <div className="learn-page">
      <header className="learn-header">
        <div className="learn-logo" onClick={() => navigate('/home')}>Tatarby</div>
        <nav className="learn-nav">
          <button className="learn-nav-item active">Читать</button>
          <button className="learn-nav-item" onClick={() => navigate('/cards')}>Карточки</button>
          <button className="learn-nav-item" onClick={() => navigate('/questions')}>Вопросы</button>
          <button className="learn-nav-item" onClick={() => navigate('/profile')}>Профиль</button>
        </nav>
      </header>

      <div className="read-container">
        <div className="read-meta">
          <span className="read-level">{demoReadingText.level}</span>
          <span className="read-title">{demoReadingText.title}</span>
        </div>

        <div className="read-content">
          {demoReadingText.content}
        </div>

        <details className="read-translation">
          <summary>Показать перевод</summary>
          <p>{demoReadingText.translation}</p>
        </details>

        <div className="read-words">
          <h3>Новые слова</h3>
          <div className="read-words-list">
            {demoReadingText.newWords.map((w, i) => (
              <span key={i} className="read-word-tag">{w}</span>
            ))}
          </div>
        </div>

        <div className="read-actions">
          <button className="learn-btn-primary" onClick={() => navigate('/questions')}>
            Пройти вопросы
          </button>
        </div>
      </div>
    </div>
  );
}