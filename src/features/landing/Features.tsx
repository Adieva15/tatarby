import { Camera, Sparkles, BookOpen, TrendingUp} from "lucide-react";

const FEATURES = [
  {
    icon: Camera,
    title: "Загрузка текста",
    desc: "Фото, PDF или вставка вручную — распознаём татарский за секунды.",
  },
  {
    icon: Sparkles,
    title: "Умная адаптация",
    desc: "Умный помощник подстраивает лексику под твой уровень и возраст.",
  },
  {
    icon: BookOpen,
    title: "Подсказки и перевод",
    desc: "Нажми на слово — увидишь перевод и пояснение в контексте.",
  },
  {
    icon: TrendingUp,
    title: "Практика и прогресс",
    desc: "Вопросы, карточки слов, свои предложения — и рост к оригиналу.",
  },
];

export function Features() {
  return (
    <section className="mt-12 md:mt-16 py-12 md:py-20 bg-accent text-white -mx-4 px-4 md:rounded-3xl md:mx-0">
      <h2 className="text-center font-serif text-4xl md:text-5xl">
        Почему <em className="text-gold">мы</em>?
      </h2>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-6xl mx-auto">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="bg-accent-dark rounded-2xl p-6 border border-white/10 flex flex-col items-center text-center"
          >
            <Icon className="w-6 h-6 mb-4 text-gold" />
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="mt-2 text-sm opacity-80">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}