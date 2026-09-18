// Демо-данные за 365 дней
// Когда бэкенд будет готов — замените на реальные запросы

export const demoUserStats = {
  current_streak: 12,
  longest_streak: 28,
  longest_streak_date: '2026-08-15',
  last_activity_date: new Date().toISOString().split('T')[0],
  total_xp: 3450,
  total_lessons: 47,
  total_words_learned: 312,
  member_since: '2026-01-15',
};

// 365 дней активности. Каждый день — либо был, либо нет.
export function generateYearActivity() {
  const days = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 364);

  for (let i = 0; i < 365; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();

    // Вероятность активности: выше в последние 60 дней, ниже по выходным
    const isRecent = i > 305;
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    let probability = isRecent ? 0.7 : 0.45;
    if (isWeekend) probability -= 0.2;

    const active = Math.random() < probability;
    const xp = active ? 80 + Math.floor(Math.random() * 220) : 0;
    const lessons = active ? 1 + Math.floor(Math.random() * 4) : 0;
    const words = active ? 8 + Math.floor(Math.random() * 25) : 0;

    days.push({ date: dateStr, active, xp, lessons, words });
  }
  return days;
}

export const LEVEL_XP = 1000;

export function getLevel(totalXp) {
  return Math.floor(totalXp / LEVEL_XP) + 1;
}

export function getXpToNextLevel(totalXp) {
  const currentLevelXp = totalXp % LEVEL_XP;
  return {
    current: currentLevelXp,
    needed: LEVEL_XP - currentLevelXp,
    percent: (currentLevelXp / LEVEL_XP) * 100,
  };
}

// ===== Аналитика =====

// Средний XP в день за последние N дней
export function getAverageXp(activity, days = 30) {
  const recent = activity.slice(-days).filter(d => d.active);
  if (recent.length === 0) return 0;
  return Math.round(recent.reduce((s, d) => s + d.xp, 0) / days);
}

// Прогноз: через сколько дней достигнешь следующего уровня
export function getEtaToNextLevel(totalXp, avgXpPerDay) {
  const { needed } = getXpToNextLevel(totalXp);
  if (avgXpPerDay <= 0) return null;
  return Math.ceil(needed / avgXpPerDay);
}

// Процент активных дней за последние N дней
export function getConsistency(activity, days = 30) {
  const recent = activity.slice(-days);
  const active = recent.filter(d => d.active).length;
  return Math.round((active / days) * 100);
}

// Лучший день недели (по среднему XP)
export function getBestDayOfWeek(activity) {
  const daysRu = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
  const stats = Array(7).fill(0).map(() => ({ total: 0, count: 0 }));

  activity.forEach(d => {
    const dow = new Date(d.date).getDay();
    stats[dow].total += d.xp;
    stats[dow].count += 1;
  });

  let bestDay = 0;
  let bestAvg = 0;
  stats.forEach((s, i) => {
    const avg = s.count > 0 ? s.total / s.count : 0;
    if (avg > bestAvg) {
      bestAvg = avg;
      bestDay = i;
    }
  });

  return { name: daysRu[bestDay], avgXp: Math.round(bestAvg) };
}

// Прогноз стрика: продолжит ли серию сегодня
export function getStreakForecast(activity) {
  const last14 = activity.slice(-14);
  const activeCount = last14.filter(d => d.active).length;
  const probability = Math.round((activeCount / 14) * 100);
  return probability;
}

// Прогресс-точки для следующей вехи
export function getNextMilestone(stats) {
  const milestones = [
    { name: '1000 XP', current: stats.total_xp, target: 1000, type: 'xp' },
    { name: '5000 XP', current: stats.total_xp, target: 5000, type: 'xp' },
    { name: '10 000 XP', current: stats.total_xp, target: 10000, type: 'xp' },
    { name: '50 уроков', current: stats.total_lessons, target: 50, type: 'lessons' },
    { name: '100 уроков', current: stats.total_lessons, target: 100, type: 'lessons' },
    { name: '500 слов', current: stats.total_words_learned, target: 500, type: 'words' },
    { name: '1000 слов', current: stats.total_words_learned, target: 1000, type: 'words' },
    { name: 'Стрик 30 дней', current: stats.current_streak, target: 30, type: 'streak' },
    { name: 'Стрик 100 дней', current: stats.current_streak, target: 100, type: 'streak' },
  ];

  return milestones.find(m => m.current < m.target) || milestones[milestones.length - 1];
}

export const demoAchievements = [
  { id: 1, title: 'Неделя подряд', description: 'Стрик 7 дней', unlocked: true },
  { id: 2, title: 'Скороход', description: '1000 XP', unlocked: true },
  { id: 3, title: 'Основа', description: 'Символ постоянства', unlocked: true },
  { id: 4, title: 'Книжный червь', description: '50 уроков', unlocked: false },
  { id: 5, title: 'Месяц силы', description: 'Стрик 30 дней', unlocked: false },
  { id: 6, title: 'Звёздный час', description: '5000 XP', unlocked: false },
  { id: 7, title: 'Полиглот', description: '500 слов', unlocked: false },
  { id: 8, title: 'Меткий стрелок', description: '100 уроков', unlocked: false },
];

export const MONTHS_RU = [
  'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
  'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'
];