import { useUserStore } from "@/entities/user/store";
import { LandingPage } from "./LandingPage";
import { AppHomePage } from "./AppHomePage";

export function HomePage() {
  const user = useUserStore((s) => s.user);

  return user ? <AppHomePage /> : <LandingPage />;
}