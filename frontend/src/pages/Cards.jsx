import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { demoWordCards } from '../data/demoStats';
import Navigation from '../components/Navigation';
import '../styles/learn.css';

export default function Cards() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState([]);

  const card = demoWordCards[index];
  const progress = ((index) / demoWordCards.length) * 100;

  const handleKnow = () => {
    setKnown([...known, card.id]);
    next();
  };

  const next = () => {
    setFlipped(false);
    if (index + 1 < demoWordCards.length) {
      setIndex(index + 1);
    } else {
      setIndex(demoWordCards.length);
    }
  };

  if (index >= demoWordCards.length) {
    return (
      <div className="learn-page">
        <Navigation />

        <div className="learn-result">
          <h1>Карточки пройдены</h1>
          <div className="result-score">{known.length}</div>
          <p className="result-text">слов отмечено как знакомые</p>
          <div className="result-actions">
            <button className="learn-btn-primary" onClick={() => navigate('/questions')}>
              Пройти вопросы
            </button>
            <button className="learn-btn-secondary" onClick={() => {
              setIndex(0);
              setKnown([]);
              setFlipped(false);
            }}>
              Повторить
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="learn-page">
      <Navigation />

      <div className="learn-progress-bar">
        <div className="learn-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="card-wrapper">
        <div
          className={`flash-card ${flipped ? 'flipped' : ''}`}
          onClick={() => setFlipped(!flipped)}
        >
          <div className="flash-card-inner">
            <div className="flash-card-front">
              <div className="flash-card-label">Татарча</div>
              <div className="flash-card-text">{card.word}</div>
              <div className="flash-card-hint">Нажми, чтобы увидеть перевод</div>
            </div>
            <div className="flash-card-back">
              <div className="flash-card-label">Русча</div>
              <div className="flash-card-text">{card.translation}</div>
            </div>
          </div>
        </div>

        <div className="card-actions">
          <button className="learn-btn-secondary" onClick={next}>
            Не знаю
          </button>
          <button className="learn-btn-primary" onClick={handleKnow}>
            Знаю
          </button>
        </div>

        <div className="card-counter">
          {index + 1} / {demoWordCards.length}
        </div>
      </div>
    </div>
  );
}