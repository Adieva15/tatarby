import { Link, Outlet, useLocation } from "react-router-dom";
import { BookOpen, User } from "lucide-react";
import { useUserStore } from "@/entities/user/store";
import { Button } from "@/shared/ui";

export function RootLayout() {
  const { pathname } = useLocation();
  const user = useUserStore((s) => s.user);

  return (
    <div className="min-h-full flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold text-brand-700">
            <BookOpen className="w-5 h-5" />
            Адаптив уку
          </Link>

          <nav className="flex items-center gap-2">
            {user ? (
              pathname !== "/profile" && (
                <Link
                  to="/profile"
                  className="flex items-center gap-2 pl-1 pr-3 h-10 rounded-full border border-slate-200 hover:border-brand-300 hover:bg-brand-50 transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">{user.name}</span>
                </Link>
              )
            ) : (
              <Link to="/login">
                <Button size="sm">Войти / Зарегистрироваться</Button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        <Outlet />
      </main>

      <footer className="text-center text-xs text-slate-500 py-6">
        © {new Date().getFullYear()} Название проекта
      </footer>
    </div>
  );
}