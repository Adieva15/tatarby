import { Link } from "react-router-dom";
import { Upload, Camera, FileText, BookMarked, Sparkles } from "lucide-react";
import { Button, Card, ProgressBar } from "@/shared/ui";
import { useUserStore } from "@/entities/user/store";

export function HomePage() {
  const user = useUserStore((s) => s.user);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-br from-brand-50 to-white border border-brand-100 p-8 md:p-12">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 text-xs font-medium text-brand-700 bg-brand-100 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            Персональный помощник чтения
          </span>
          <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight text-slate-900">
            Читай по-татарски <span className="text-brand-600">в своём темпе</span>
          </h1>
          <p className="mt-3 text-slate-600 md:text-lg">
            Загрузи фото страницы или PDF — мы распознаем текст, адаптируем его под
            твой уровень и поможем понять каждое слово.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/upload">
              <Button size="lg">
                <Upload className="w-5 h-5 mr-2" />
                Загрузить текст
              </Button>
            </Link>
            <Button size="lg" variant="secondary">
              Попробовать демо
            </Button>
          </div>
        </div>
      </section>

      {user && (
        <section className="grid md:grid-cols-3 gap-4">
          <Card className="p-5 md:col-span-2">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">Исәнме,</p>
                <p className="text-xl font-semibold">{user.name}!</p>
              </div>
              <Link to="/profile" className="text-sm text-brand-600 hover:underline">
                Изменить
              </Link>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500">Уровень</p>
                <p className="text-lg font-semibold">{user.level}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Возрастная группа</p>
                <p className="text-lg font-semibold">
                  {user.ageGroup === "child" && "Ребёнок"}
                  {user.ageGroup === "teen" && "Подросток"}
                  {user.ageGroup === "adult" && "Взрослый"}
                </p>
              </div>
            </div>

            <div className="mt-5">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Прогресс до следующего уровня</span>
                <span>60%</span>
              </div>
              <ProgressBar value={60} />
            </div>
          </Card>

          <Card className="p-5 flex flex-col justify-between">
            <div>
              <p className="text-xs text-slate-500">Текущая серия</p>
              <p className="text-3xl font-bold">{user.streakDays} 🔥</p>
              <p className="text-sm text-slate-500 mt-1">дней подряд</p>
            </div>
            <p className="text-xs text-slate-400 mt-4">Читай сегодня, чтобы продлить</p>
          </Card>
        </section>
      )}

      <section>
        <h2 className="text-lg font-semibold mb-3">Как добавить текст</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: Camera, title: "Фото страницы", desc: "Сфотографируй книгу или распечатку" },
            { icon: FileText, title: "PDF-документ", desc: "Загрузи файл с текстом" },
            { icon: BookMarked, title: "Вставить вручную", desc: "Скопируй и вставь текст" },
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

      <section>
        <h2 className="text-lg font-semibold mb-3">Продолжить чтение</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { title: "Габдулла Тукай — Шүрәле", progress: 60, level: "A2" },
            { title: "Народная сказка — Камыр батыр", progress: 25, level: "A1" },
            { title: "Статья — Казан сегодня", progress: 80, level: "B1" },
          ].map((t) => (
            <Card key={t.title} className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full">{t.level}</span>
                <span className="text-xs text-slate-500">{t.progress}%</span>
              </div>
              <p className="mt-3 font-medium">{t.title}</p>
              <ProgressBar value={t.progress} className="mt-3" />
              <Link to="/read/demo">
                <Button variant="secondary" size="sm" className="mt-4 w-full">
                  Продолжить
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}