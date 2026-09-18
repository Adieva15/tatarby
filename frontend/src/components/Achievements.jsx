import '../styles/stats.css';
import { demoAchievements } from '../data/demoStats';

export default function Achievements() {
  return (
    <div className="achievements">
      <div className="analytics-header">
        <h3>Достижения</h3>
        <p className="analytics-subtitle">
          {demoAchievements.filter(a => a.unlocked).length} из {demoAchievements.length} открыто
        </p>
      </div>
      <div className="achievements-grid">
        {demoAchievements.map((a) => (
          <div
            key={a.id}
            className={`achievement ${a.unlocked ? 'achievement-unlocked' : 'achievement-locked'}`}
          >
            <div className="achievement-title">{a.title}</div>
            <div className="achievement-desc">{a.description}</div>
            <div className="achievement-status">
              {a.unlocked ? 'Открыто' : 'Закрыто'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}