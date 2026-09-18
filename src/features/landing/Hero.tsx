import { Link } from "react-router-dom";
import { Button } from "@/shared/ui";

export function Hero() {
  return (
    <section className="py-16 md:py-24 text-center">
      <h1 className="font-serif text-6xl md:text-8xl font-bold tracking-tight">
        Название<br/>проекта
      </h1>
    <img
        src="/tatar.webp"
        className="mt-10 mx-auto w-full max-w-md rounded-3xl shadow-lg"
    />
      <p className="mt-6 max-w-xl mx-auto text-slate-600 md:text-lg">
        Татарский язык — это целый мир. Открой его шаг за шагом, слово за словом.
      </p>
      <div className="mt-8">
        <Link to="/login">
          <Button size="lg" variant="gold">Начать читать</Button>
        </Link>
      </div>
    </section>
  );
}