import { create } from "zustand";
import type { User } from "@/shared/types";

interface UserState {
  user: User | null;
  setUser: (u: User | null) => void;
  updateLevel: (level: User["level"]) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: {
    id: "demo",
    name: "Алия",
    ageGroup: "teen",
    level: "A2",
    streakDays: 3,
  },
  setUser: (user) => set({ user }),
  updateLevel: (level) =>
    set((s) => (s.user ? { user: { ...s.user, level } } : s)),
}));