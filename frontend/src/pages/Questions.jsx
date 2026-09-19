import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { demoQuestions } from "../data/demoStats";
import QuestionCard from "../components/QuestionCard";
import Navigation from "../components/Navigation";
import "../styles/learn.css";

export default function Questions() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) setCorrectCount((c) => c + 1);

    if (current + 1 < demoQuestions.length) {
      setCurrent((c) => c + 1);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    const percent = Math.round((correctCount / demoQuestions.length) * 100);
    return (
      <div className="learn-page">
        <Navigation />

        <div className="learn-result">
          <h1>Вопросы завершены</h1>
          <div className="result-score">{percent}%</div>
          <p className="result-text">
            Правильных ответов: {correctCount} из {demoQuestions.length}
          </p>
          <div className="result-actions">
            <button
              className="learn-btn-primary"
              onClick={() => navigate("/essay")}
            >
              Перейти к сочинению
            </button>
            <button
              className="learn-btn-secondary"
              onClick={() => navigate("/read")}
            >
              Читать снова
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
        <div
          className="learn-progress-fill"
          style={{ width: `${(current / demoQuestions.length) * 100}%` }}
        />
      </div>

      <QuestionCard
        key={current}
        question={demoQuestions[current]}
        index={current}
        total={demoQuestions.length}
        onAnswer={handleAnswer}
      />
    </div>
  );
}
