import '../styles/stats.css';
import { generateYearActivity } from '../data/demoStats';

export default function XpChart() {
  const activity = generateYearActivity();
  // Берём последние 30 дней
  const last30 = activity.slice(-30);

  const width = 800;
  const height = 180;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxXp = Math.max(...last30.map(d => d.xp), 100);

  // Точки графика
  const points = last30.map((d, i) => {
    const x = padding.left + (i / (last30.length - 1)) * chartWidth;
    const y = padding.top + chartHeight - (d.xp / maxXp) * chartHeight;
    return { x, y, xp: d.xp, date: d.date };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`;

  // Средняя линия
  const avgXp = last30.reduce((s, d) => s + d.xp, 0) / last30.length;
  const avgY = padding.top + chartHeight - (avgXp / maxXp) * chartHeight;

  return (
    <div className="xp-chart">
      <div className="activity-header">
        <h3>Динамика XP</h3>
        <p className="activity-subtitle">Последние 30 дней</p>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="xp-chart-svg" preserveAspectRatio="xMidYMid meet">
        {/* Горизонтальные линии */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = padding.top + chartHeight * (1 - ratio);
          return (
            <g key={i}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="#EBEDF0"
                strokeWidth="1"
              />
              <text
                x={padding.left - 8}
                y={y + 4}
                textAnchor="end"
                fontSize="11"
                fill="#7A7062"
              >
                {Math.round(maxXp * ratio)}
              </text>
            </g>
          );
        })}

        {/* Средняя линия */}
        <line
          x1={padding.left}
          y1={avgY}
          x2={width - padding.right}
          y2={avgY}
          stroke="#D4A017"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {/* Область под линией */}
        <path d={areaPath} fill="rgba(0, 155, 119, 0.08)" />

        {/* Линия */}
        <path d={linePath} fill="none" stroke="#009B77" strokeWidth="2" />

        {/* Точки */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="#009B77" />
        ))}

        {/* Подпись «среднее» */}
        <text
          x={width - padding.right}
          y={avgY - 6}
          textAnchor="end"
          fontSize="11"
          fill="#D4A017"
          fontWeight="600"
        >
          среднее {Math.round(avgXp)} XP
        </text>

        {/* Подписи дат */}
        {[0, Math.floor(last30.length / 2), last30.length - 1].map((i) => {
          const d = new Date(last30[i].date);
          const label = `${d.getDate()}.${String(d.getMonth() + 1).padStart(2, '0')}`;
          const x = padding.left + (i / (last30.length - 1)) * chartWidth;
          return (
            <text
              key={i}
              x={x}
              y={height - 8}
              textAnchor="middle"
              fontSize="11"
              fill="#7A7062"
            >
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}