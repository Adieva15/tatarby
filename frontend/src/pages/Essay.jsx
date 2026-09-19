import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { demoEssayTask, checkEssay } from '../data/demoStats';
import '../styles/learn.css';

export default function Essay() {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [checking, setChecking] = useState(false);

  const handleCheck = async () => {
    if (text.trim().length < 5) return;
    setChecking(true);
    // Имитация запроса к ИИ
    await new Promise(r => setTimeout(r, 1200));
    setResult(checkEssay(text));
    setChecking(false);
  };

  const handleReset = () => {
    setText('');
    setResult(null);
  };

  return (
    <div className="learn-page">
      <header className="learn-header">
        <div className="learn-logo" onClick={() => navigate('/home')}>Tatarby</div>
        <nav className="learn-nav">
          <button className="learn-nav-item" onClick={() => navigate('/read')}>Читать</button>
          <button className="learn-nav-item" onClick={() => navigate('/cards')}>Карточки</button>
          <button className="learn-nav-item" onClick={() => navigate('/questions')}>Вопросы</button>
          <button className="learn-nav-item" onClick={() => navigate('/profile')}>Профиль</button>
        </nav>
      </header>

      <div className="essay-container">
        <h1 className="essay-title">{demoEssayTask.title}</h1>
        <p className="essay-description">{demoEssayTask.description}</p>

        <div className="essay-required">
          <div className="essay-required-label">Обязательные слова:</div>
          <div className="essay-required-list">
            {demoEssayTask.requiredWords.map((w, i) => {
              const used = result?.usedWords.includes(w);
              return (
                <span key={i} className={`essay-word-tag ${used ? 'used' : ''}`}>
                  {w}
                </span>
              );
            })}
          </div>
        </div>

        {!result ? (
          <>
            <textarea
              className="essay-textarea"
              placeholder="Яз монда..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={8}
              disabled={checking}
            />
            <div className="essay-meta">
              <span>Слов: {text.trim().split(/\s+/).filter(Boolean).length}</span>
              <span>Минимум: {demoEssayTask.minWords}</span>
            </div>

            <div className="essay-actions">
              <button
                className="learn-btn-primary"
                onClick={handleCheck}
                disabled={checking || text.trim().length < 5}
              >
                {checking ? 'Проверка...' : 'Проверить'}
              </button>
            </div>
          </>
        ) : (
          <div className="essay-result">
            <div className="essay-score">{result.score}%</div>
            <p className="essay-feedback">{result.feedback}</p>

            <div className="essay-result-section">
              <div className="essay-result-label">Использованные слова:</div>
              <div className="essay-required-list">
                {result.usedWords.length > 0 ? result.usedWords.map((w, i) => (
                  <span key={i} className="essay-word-tag used">{w}</span>
                )) : <span className="essay-empty">—</span>}
              </div>
            </div>

            {result.missingWords.length > 0 && (
              <div className="essay-result-section">
                <div className="essay-result-label">Пропущенные слова:</div>
                <div className="essay-required-list">
                  {result.missingWords.map((w, i) => (
                    <span key={i} className="essay-word-tag missing">{w}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="essay-result-section">
              <div className="essay-result-label">Твой текст ({result.wordCount} слов):</div>
              <div className="essay-text-preview">{text}</div>
            </div>

            <div className="essay-actions">
              <button className="learn-btn-secondary" onClick={handleReset}>
                Написать заново
              </button>
              <button className="learn-btn-primary" onClick={() => navigate('/profile')}>
                В профиль
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}