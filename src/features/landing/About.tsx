import { BookOpen, Sparkles, GraduationCap } from "lucide-react";

const POINTS = [
  {
    icon: BookOpen,
    title: "Начни с простого",
    desc: "Адаптированные тексты, которые читаются с первого раза.",
  },
  {
    icon: Sparkles,
    title: "Умная адаптация",
    desc: "Сложность подстраивается под твой прогресс.",
  },
  {
    icon: GraduationCap,
    title: "Дойди до оригинала",
    desc: "Постепенно — до свободного чтения на татарском.",
  },
];

export function About() {
  return (
    <section className="mt-12 md:mt-16 py-12 md:py-20 bg-brand-600 text-white -mx-4 px-4 md:rounded-3xl md:mx-0">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        {/* Левая колонка — только заголовок */}
        <div>
          <span className="inline-block text-sm uppercase tracking-widest text-gold mb-4">
            О проекте
          </span>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight">
            Читай на татарском <em className="text-gold">в комфортном темпе</em>
          </h2>
        </div>

        {/* Правая колонка — три пункта */}
        <div className="space-y-4">
          {POINTS.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex gap-4 bg-white/5 border border-white/10 rounded-2xl p-5"
            >
              <div className="shrink-0 w-10 h-10 rounded-xl bg-gold/20 text-gold flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-white/70 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}