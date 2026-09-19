import '../styles/stats.css';

export default function StatsPanel({ stats }) {
  const xpProgress = {
    percent: stats.xp_to_next_level
      ? ((1000 - stats.xp_to_next_level) / 1000) * 100
      : 100,
    needed: stats.xp_to_next_level || 0,
  };

  return (
    <div className="stats-panel">
      <div className="stats-card stats-card-xp">
        <div className="stats-card-header">
          <span className="stats-label">Уровень {stats.level}</span>
        </div>
        <div className="stats-value">{stats.total_xp.toLocaleString('ru-RU')} XP</div>
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
        <div className="stats-value">{stats.current_streak}</div>
        <div className="stats-sub">Рекорд: {stats.longest_streak} дней</div>
      </div>

      <div className="stats-card stats-card-lessons">
        <div className="stats-card-header">
          <span className="stats-label">Уроки</span>
        </div>
        <div className="stats-value">{stats.total_lessons}</div>
        <div className="stats-sub">Пройдено</div>
      </div>

      <div className="stats-card stats-card-words">
        <div className="stats-card-header">
          <span className="stats-label">Слова</span>
        </div>
        <div className="stats-value">{stats.total_words_learned}</div>
        <div className="stats-sub">Выучено</div>
      </div>
    </div>
  );
}