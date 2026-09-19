import { useState } from 'react';

export default function QuestionCard({ question, index, total, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (i) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);

    const isCorrect = i === question.correctIndex;
    setTimeout(() => {
      onAnswer(isCorrect);
    }, 800);
  };

  return (
    <div className="question-card">
      <div className="question-meta">
        Вопрос {index + 1} из {total}
      </div>
      <h2 className="question-title">{question.question}</h2>

      <div className="question-options">
        {question.options.map((opt, i) => {
          let className = 'question-option';
          if (answered) {
            if (i === question.correctIndex) className += ' option-correct';
            else if (i === selected) className += ' option-wrong';
          } else if (i === selected) {
            className += ' option-selected';
          }
          return (
            <button
              key={i}
              className={className}
              onClick={() => handleSelect(i)}
              disabled={answered}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}