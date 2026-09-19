import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adaptiveTexts, knownWords, wordDictionary } from '../data/demoStats';
import Navigation from '../components/Navigation';
import '../styles/learn.css';

export default function Read() {
  const navigate = useNavigate();
  const [level, setLevel] = useState('A1');
  const [visibleCount, setVisibleCount] = useState(1);
  const [showTranslation, setShowTranslation] = useState(false);
  const [tooltip, setTooltip] = useState(null);

  const text = adaptiveTexts[level];
  const sentences = text.sentences;
  const visibleSentences = sentences.slice(0, visibleCount);
  const hasMore = visibleCount < sentences.length;
  const progress = (visibleCount / sentences.length) * 100;

  const renderSentence = (sentence) => {
    const words = sentence.tat.split(/(\s+|[.,!?])/);
    return words.map((w, i) => {
      const clean = w.toLowerCase().replace(/[.,!?]/g, '');
      if (!clean) return <span key={i}>{w}</span>;

      const isKnown = knownWords.includes(clean);
      const hasTranslation = wordDictionary[clean];

      return (
        <span
          key={i}
          className={`read-word ${isKnown ? 'known' : ''} ${hasTranslation && !isKnown ? 'new' : ''}`}
          onClick={() => hasTranslation && setTooltip({ word: clean, translation: wordDictionary[clean] })}
        >
          {w}
        </span>
      );
    });
  };

  return (
    <div className="learn-page">
      <Navigation />

      <div className="read-container">
        <div className="read-levels">
          <span className="read-levels-label">Уровень:</span>
          {['A1', 'A2', 'B1'].map(l => (
            <button
              key={l}
              className={`read-level-btn ${level === l ? 'active' : ''}`}
              onClick={() => {
                setLevel(l);
                setVisibleCount(1);
              }}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="read-meta">
          <span className="read-level">{text.level}</span>
          <span className="read-title">{text.title}</span>
        </div>

        <div className="read-progress">
          <div className="read-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className={`read-content read-content-${level.toLowerCase()}`}>
          {visibleSentences.map((s, i) => (
            <div key={i} className="read-sentence">
              <div className="read-sentence-tat">{renderSentence(s)}</div>
              {showTranslation && (
                <div className="read-sentence-rus">{s.rus}</div>
              )}
            </div>
          ))}
        </div>

        <div className="read-controls">
          <button
            className="learn-btn-secondary"
            onClick={() => setShowTranslation(!showTranslation)}
          >
            {showTranslation ? 'Скрыть перевод' : 'Показать перевод'}
          </button>
          {hasMore && (
            <button
              className="learn-btn-primary"
              onClick={() => setVisibleCount(c => c + 1)}
            >
              Следующее предложение →
            </button>
          )}
        </div>

        {!hasMore && (
          <div className="read-complete">
            <p>Текст прочитан полностью</p>
            <button className="learn-btn-primary" onClick={() => navigate('/questions')}>
              Пройти вопросы
            </button>
          </div>
        )}

        {tooltip && (
          <div className="read-tooltip-overlay" onClick={() => setTooltip(null)}>
            <div className="read-tooltip" onClick={(e) => e.stopPropagation()}>
              <div className="read-tooltip-word">{tooltip.word}</div>
              <div className="read-tooltip-translation">{tooltip.translation}</div>
              <button className="read-tooltip-close" onClick={() => setTooltip(null)}>×</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}