import { Link } from "react-router-dom";
import { Camera, FileText, BookMarked, Play, Flame } from "lucide-react";
import { Card, ProgressBar, Button } from "@/shared/ui";
import { useUserStore } from "@/entities/user/store";

const RECOMMENDED = [
  { id: "1", title: "Габдулла Тукай — Шүрәле", level: "A2", minutes: 8 },
  { id: "2", title: "Народная сказка — Камыр батыр", level: "A1", minutes: 5 },
  { id: "3", title: "Статья — Казан сегодня", level: "B1", minutes: 10 },
];

export function AppHomePage() {
  const user = useUserStore((s) => s.user);
  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* Приветствие */}
      <section>
        <h1 className="font-serif text-4xl md:text-5xl">
          Исәнме, <span className="text-brand-600">{user.name}</span>!
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-base md:text-lg text-slate-600">
          <span>Уровень <strong className="text-slate-900 font-semibold">{user.level}</strong></span>
          <span className="inline-flex items-center gap-1.5">
            <Flame className="w-5 h-5 text-accent" />
            <strong className="text-slate-900 font-semibold">{user.streakDays}</strong> дня подряд
          </span>
        </div>
      </section>

      {/* Продолжить чтение */}
      <section>
        <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4">Продолжить чтение</h2>
        <Card className="p-6 md:p-8 bg-gradient-to-br from-brand-600 to-brand-700 text-white border-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1">
              <span className="inline-block text-xs bg-white/15 px-2 py-0.5 rounded-full">
                Уровень A2
              </span>
              <h3 className="mt-3 text-2xl font-serif">Шүрәле — Габдулла Тукай</h3>
              <p className="mt-2 text-white/70 text-sm">
                Ты остановился на середине. Осталось ~4 минуты.
              </p>
              <div className="mt-4 max-w-xs">
                <div className="flex justify-between text-xs text-white/70 mb-1">
                  <span>Прочитано</span>
                  <span>60%</span>
                </div>
                <ProgressBar value={60} className="bg-white/20 [&>div]:bg-gold" />
              </div>
            </div>

            <Link to="/read/demo">
              <Button variant="gold" size="lg">
                <Play className="w-5 h-5 mr-2" />
                Продолжить
              </Button>
            </Link>
          </div>
        </Card>
      </section>

      {/* Загрузить новый текст */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Добавить текст</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: Camera, title: "Фото страницы", desc: "Сфотографируй книгу" },
            { icon: FileText, title: "PDF-документ", desc: "Загрузи файл" },
            { icon: BookMarked, title: "Вставить вручную", desc: "Скопируй текст" },
          ].map(({ icon: Icon, title, desc }) => (
            <Link to="/upload" key={title}>
              <Card className="p-5 hover:border-brand-300 hover:shadow-md transition cursor-pointer h-full">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <p className="mt-3 font-medium">{title}</p>
                <p className="text-sm text-slate-500 mt-1">{desc}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Рекомендации */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Под твой уровень</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {RECOMMENDED.map((t) => (
            <Card key={t.id} className="p-5 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full">
                  {t.level}
                </span>
                <span className="text-xs text-slate-500">{t.minutes} мин</span>
              </div>
              <p className="mt-3 font-medium flex-1">{t.title}</p>
              <Link to={`/read/${t.id}`}>
                <Button variant="secondary" size="sm" className="mt-4 w-full">
                  Читать
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* Ссылка на профиль (аналитика — у напарника) */}
      <section>
        <Link
          to="/profile"
          className="block text-center text-sm text-brand-600 hover:underline"
        >
          Посмотреть всю статистику →
        </Link>
      </section>
    </div>
  );
}