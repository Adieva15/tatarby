import '../styles/stats.css';
import {
  generateYearActivity,
  demoUserStats,
  getAverageXp,
  getEtaToNextLevel,
  getConsistency,
  getBestDayOfWeek,
  getStreakForecast,
  getNextMilestone,
  getLevel,
} from '../data/demoStats';

export default function Analytics() {
  const activity = generateYearActivity();

  const avgXp = getAverageXp(activity, 30);
  const eta = getEtaToNextLevel(demoUserStats.total_xp, avgXp);
  const consistency30 = getConsistency(activity, 30);
  const consistency7 = getConsistency(activity, 7);
  const bestDay = getBestDayOfWeek(activity);
  const streakForecast = getStreakForecast(activity);
  const milestone = getNextMilestone(demoUserStats);
  const milestonePercent = Math.min(100, Math.round((milestone.current / milestone.target) * 100));
  const level = getLevel(demoUserStats.total_xp);

  return (
    <div className="analytics">
      <div className="analytics-header">
        <h3>Аналитика</h3>
        <p className="analytics-subtitle">Прогнозы и закономерности на основе твоих данных</p>
      </div>

      <div className="analytics-grid">
        {/* Средний XP в день */}
        <div className="analytics-card">
          <div className="analytics-label">Средний XP в день</div>
          <div className="analytics-value">{avgXp}</div>
          <div className="analytics-sub">за последние 30 дней</div>
          <div className="analytics-bar">
            <div className="analytics-bar-fill" style={{ width: `${Math.min(100, (avgXp / 300) * 100)}%` }} />
          </div>
        </div>

        {/* ETA до уровня */}
        <div className="analytics-card">
          <div className="analytics-label">До уровня {level + 1}</div>
          <div className="analytics-value">
            {eta !== null ? `${eta} дн.` : '—'}
          </div>
          <div className="analytics-sub">
            {eta !== null ? `при текущем темпе` : 'нужна активность'}
          </div>
        </div>

        {/* Консистентность за 30 дней */}
        <div className="analytics-card">
          <div className="analytics-label">Консистентность</div>
          <div className="analytics-value">{consistency30}%</div>
          <div className="analytics-sub">за 30 дней · {consistency7}% за 7</div>
          <div className="analytics-bar">
            <div className="analytics-bar-fill" style={{ width: `${consistency30}%` }} />
          </div>
        </div>

        {/* Лучший день недели */}
        <div className="analytics-card">
          <div className="analytics-label">Лучший день</div>
          <div className="analytics-value analytics-value-small">{bestDay.name}</div>
          <div className="analytics-sub">в среднем {bestDay.avgXp} XP</div>
        </div>

        {/* Прогноз стрика */}
        <div className="analytics-card">
          <div className="analytics-label">Прогноз стрика</div>
          <div className="analytics-value">{streakForecast}%</div>
          <div className="analytics-sub">вероятность продлить сегодня</div>
          <div className="analytics-bar">
            <div className="analytics-bar-fill" style={{ width: `${streakForecast}%` }} />
          </div>
        </div>

        {/* Следующая веха */}
        <div className="analytics-card">
          <div className="analytics-label">Следующая цель</div>
          <div className="analytics-value analytics-value-small">{milestone.name}</div>
          <div className="analytics-sub">
            {milestone.current} / {milestone.target} · {milestonePercent}%
          </div>
          <div className="analytics-bar">
            <div className="analytics-bar-fill" style={{ width: `${milestonePercent}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}