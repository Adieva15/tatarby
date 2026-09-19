import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { demoUserStats, getLevel } from "../data/demoStats";
import Navigation from "../components/Navigation";
import { OrnamentDot } from "../components/Ornament";
import "../styles/home.css";
import "../styles/ornament.css";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const level = getLevel(demoUserStats.total_xp);

  return (
    <div className="home-page">
      <Navigation />

      <main className="home-main">
        {/* HERO */}
        <section className="home-hero">
          <div className="home-hero-marker">
            <OrnamentDot size={16} color="#009B77" />
            <span className="home-hero-marker-text">
              Татарский язык · Онлайн
            </span>
          </div>

          <h1 className="home-hero-title">Нур</h1>

          <p className="home-hero-subtitle">
            Адаптивное чтение · ИИ-проверка · Прогресс каждый день
          </p>

          <button className="home-hero-cta" onClick={() => navigate("/read")}>
            Начать урок →
          </button>
        </section>

        {/* СЕТКА КАРТОЧЕК */}
        <section className="home-cards-section">
          <h2 className="home-cards-title">Модули обучения</h2>
          <p className="home-cards-subtitle">Шесть инструментов для языка</p>

          <div className="home-cards-grid">
            <button
              className="home-card-frame"
              onClick={() => navigate("/read")}
            >
              <div>
                <div className="home-card-frame-title">Чтение</div>
                <p className="home-card-frame-desc">
                  Адаптивные тексты A1–B1. Сложные слова — по клику.
                </p>
              </div>
              <span className="home-card-frame-tag">→ Текст дня</span>
            </button>

            <button
              className="home-card-frame"
              onClick={() => navigate("/cards")}
            >
              <div>
                <div className="home-card-frame-title">Карточки</div>
                <p className="home-card-frame-desc">
                  Флеш-карточки для запоминания новых слов.
                </p>
              </div>
              <span className="home-card-frame-tag">→ 7 слов</span>
            </button>

            <button
              className="home-card-frame"
              onClick={() => navigate("/questions")}
            >
              <div>
                <div className="home-card-frame-title">Вопросы</div>
                <p className="home-card-frame-desc">
                  Проверь понимание текста. ИИ оценит ответы.
                </p>
              </div>
              <span className="home-card-frame-tag">→ 4 вопроса</span>
            </button>

            <button
              className="home-card-frame"
              onClick={() => navigate("/essay")}
            >
              <div>
                <div className="home-card-frame-title">Сочинение</div>
                <p className="home-card-frame-desc">
                  Напиши текст с выученными словами. ИИ проверит.
                </p>
              </div>
              <span className="home-card-frame-tag">→ Задание дня</span>
            </button>

            <button
              className="home-card-frame"
              onClick={() => navigate("/profile")}
            >
              <div>
                <div className="home-card-frame-title">Профиль</div>
                <p className="home-card-frame-desc">
                  Стрик, XP, достижения и график активности.
                </p>
              </div>
              <span className="home-card-frame-tag">→ Статистика</span>
            </button>

            <button
              className="home-card-frame"
              onClick={() => navigate("/upload")}
            >
              <div>
                <div className="home-card-frame-title">Загрузить текст</div>
                <p className="home-card-frame-desc">
                  Фото, PDF или вручную — добавь свой текст.
                </p>
              </div>
              <span className="home-card-frame-tag">→ Импорт</span>
            </button>
          </div>
        </section>

        {/* ПРОДОЛЖИТЬ ЧТЕНИЕ */}
        <section className="home-continue-section">
          <div className="home-continue-label">Продолжить чтение</div>
          <div className="home-continue-card">
            <div className="home-continue-content">
              <div className="home-continue-badge">Уровень A2</div>
              <h3 className="home-continue-title">Шүрәле — Габдулла Тукай</h3>
              <p className="home-continue-desc">
                Ты остановился на середине. Осталось ~4 минуты.
              </p>
              <div className="home-continue-progress">
                <div className="home-continue-progress-header">
                  <span>Прочитано</span>
                  <span>60%</span>
                </div>
                <div className="home-continue-progress-bar">
                  <div
                    className="home-continue-progress-fill"
                    style={{ width: "60%" }}
                  />
                </div>
              </div>
            </div>
            <button
              className="home-continue-btn"
              onClick={() => navigate("/read")}
            >
              Продолжить
            </button>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <p className="home-footer-text">
          Нур — <em>свет знаний</em> на твоём пути
        </p>
      </footer>
    </div>
  );
}
