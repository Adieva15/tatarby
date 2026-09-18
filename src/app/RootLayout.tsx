import { Link, Outlet, useLocation } from "react-router-dom";
import { BookOpen, User } from "lucide-react";
import { useUserStore } from "@/entities/user/store";

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
            {pathname !== "/profile" && (
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 h-10 rounded-xl hover:bg-slate-100"
              >
                <User className="w-4 h-4" />
                <span className="text-sm">{user?.name ?? "Профиль"}</span>
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        <Outlet />
      </main>

      <footer className="text-center text-xs text-slate-500 py-6">
        © {new Date().getFullYear()} Адаптив уку
      </footer>
    </div>
  );
}