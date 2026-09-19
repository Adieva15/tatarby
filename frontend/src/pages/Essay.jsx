import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Navigation from "../components/Navigation";
import "../styles/learn.css";

const criteria = {
  grammar: "Грамматика",
  vocabulary: "Словарный запас",
  structure: "Оформление",
  content: "Содержание",
  level_match: "Уровень знания языка",
};

export default function Essay() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState(null);

  const handleCheck = async () => {
    if (text.trim().length < 5) return;

    setChecking(true);
    setError(null);

    try {
      const res = await api.post("/api/essay", {
        text_tat: text,
      });

      const data = res.data;

      // API returns total_score on a 1–5 scale → convert to %
      const maxScore = 5;
      const percent = Math.round((data.total_score / maxScore) * 100);

      setResult({
        score: percent,
        feedback: data.verdict,
        wordCount: text.trim().split(/\s+/).filter(Boolean).length,
        errors: data.errors ?? [],
        strengths: data.strengths ?? [],
        scores: data.scores ?? {},
      });
    } catch (e) {
      console.error(e);
      setError(
        e?.response?.data?.detail ||
          "Не удалось проверить текст. Попробуй ещё раз.",
      );
    } finally {
      setChecking(false);
    }
  };

  const handleReset = () => {
    setText("");
    setResult(null);
    setError(null);
  };

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="learn-page">
      <Navigation />

      <div className="essay-container">
        <h1 className="essay-title">Сочинение</h1>
        <h1 className="essay-description">Улучшите свои практически навыки</h1>

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
              <span>Слов: {wordCount}</span>
            </div>

            {error && <p className="essay-error">{error}</p>}

            <div className="essay-actions">
              <button
                className="learn-btn-primary"
                onClick={handleCheck}
                disabled={checking || text.trim().length < 5}
              >
                {checking ? "Проверка..." : "Проверить"}
              </button>
            </div>
          </>
        ) : (
          <div className="essay-result">
            <div className="essay-score">{result.score}%</div>
            <p className="essay-feedback">{result.feedback}</p>

            {/* Per-category breakdown */}
            {Object.keys(result.scores).length > 0 && (
              <div className="essay-result-section">
                <div className="essay-result-label">Оценки по критериям:</div>
                <ul className="essay-scores-list">
                  {Object.entries(result.scores).map(([key, val]) => (
                    <li key={key}>
                      <span className="essay-score-key">{criteria[key]} </span>
                      <span className="essay-score-val">{val}/5</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Errors */}
            {result.errors.length > 0 && (
              <div className="essay-result-section">
                <div className="essay-result-label">Ошибки:</div>
                <ul className="essay-errors-list">
                  {result.errors.map((err, i) => (
                    <li key={i}>
                      <div className="essay-error-fragment">
                        «{err.fragment}»
                      </div>
                      <div className="essay-error-problem">{err.problem}</div>
                      <div className="essay-error-correct">✓ {err.correct}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Strengths */}
            {result.strengths.length > 0 && (
              <div className="essay-result-section">
                <div className="essay-result-label">Сильные стороны:</div>
                <ul className="essay-strengths-list">
                  {result.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="essay-result-section">
              <div className="essay-result-label">
                Твой текст ({result.wordCount} слов):
              </div>
              <div className="essay-text-preview">{text}</div>
            </div>

            <div className="essay-actions">
              <button className="learn-btn-secondary" onClick={handleReset}>
                Написать заново
              </button>
              <button
                className="learn-btn-primary"
                onClick={() => navigate("/profile")}
              >
                В профиль
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
