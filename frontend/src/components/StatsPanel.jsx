import '../styles/stats.css';
import { demoUserStats, getLevel, getXpToNextLevel } from '../data/demoStats';

export default function StatsPanel() {
  const level = getLevel(demoUserStats.total_xp);
  const xpProgress = getXpToNextLevel(demoUserStats.total_xp);

  return (
    <div className="stats-panel">
      <div className="stats-card stats-card-xp">
        <div className="stats-card-header">
          <span className="stats-label">Уровень {level}</span>
        </div>
        <div className="stats-value">{demoUserStats.total_xp.toLocaleString('ru-RU')} XP</div>
        <div className="xp-bar">
          <div className="xp-bar-fill" style={{ width: `${xpProgress.percent}%` }} />
        </div>
        <div className="xp-bar-label">
          До следующего уровня: {xpProgress.needed} XP
        </div>
      </div>

      <div className="stats-card stats-card-streak">
        <div className="stats-card-header">
          <span className="stats-label">Стрик</span>
        </div>
        <div className="stats-value">{demoUserStats.current_streak}</div>
        <div className="stats-sub">Рекорд: {demoUserStats.longest_streak} дней</div>
      </div>

      <div className="stats-card stats-card-lessons">
        <div className="stats-card-header">
          <span className="stats-label">Уроки</span>
        </div>
        <div className="stats-value">{demoUserStats.total_lessons}</div>
        <div className="stats-sub">Пройдено</div>
      </div>

      <div className="stats-card stats-card-words">
        <div className="stats-card-header">
          <span className="stats-label">Слова</span>
        </div>
        <div className="stats-value">{demoUserStats.total_words_learned}</div>
        <div className="stats-sub">Выучено</div>
      </div>
    </div>
  );
}