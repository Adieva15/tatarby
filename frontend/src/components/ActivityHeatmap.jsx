import '../styles/stats.css';
import { generateYearActivity, MONTHS_RU } from '../data/demoStats';

export default function ActivityHeatmap() {
  const activity = generateYearActivity();

  // Группируем по неделям
  const weeks = [];
  let currentWeek = [];

  activity.forEach((day, i) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || i === activity.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  const activeDays = activity.filter(d => d.active).length;
  const totalXp = activity.reduce((s, d) => s + d.xp, 0);

  // Позиции месяцев
  const monthLabels = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const firstDay = new Date(week[0].date);
    const month = firstDay.getMonth();
    if (month !== lastMonth) {
      monthLabels.push({ month: MONTHS_RU[month], index: i });
      lastMonth = month;
    }
  });

  return (
    <div className="activity-heatmap">
      <div className="activity-header">
        <h3>Активность за год</h3>
        <p className="activity-subtitle">
          {activeDays} активных дней · {totalXp.toLocaleString('ru-RU')} XP всего
        </p>
      </div>

      <div className="heatmap-container">
        <div className="heatmap-months">
          {monthLabels.map((m, i) => (
            <span
              key={i}
              className="heatmap-month-label"
              style={{ gridColumnStart: m.index + 1 }}
            >
              {m.month}
            </span>
          ))}
        </div>

        <div className="heatmap-grid-wrapper">
          <div className="heatmap-days">
            <span></span>
            <span>Пн</span>
            <span></span>
            <span>Ср</span>
            <span></span>
            <span>Пт</span>
            <span></span>
          </div>

          <div className="heatmap-grid">
            {weeks.map((week, wi) => (
              <div key={wi} className="heatmap-week">
                {week.map((day, di) => (
                  <div
                    key={di}
                    className={`heatmap-cell ${day.active ? 'heatmap-cell-active' : ''}`}
                    title={`${day.date}${day.active ? ` — ${day.xp} XP` : ' — нет активности'}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="heatmap-legend">
          <span>Нет активности</span>
          <div className="heatmap-cell" />
          <div className="heatmap-cell heatmap-cell-active" />
          <span>Был активен</span>
        </div>
      </div>
    </div>
  );
}