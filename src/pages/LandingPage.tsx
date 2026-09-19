import { Hero } from "@/features/landing/Hero";
import { Features } from "@/features/landing/Features";
import { About } from "@/features/landing/About";

export function LandingPage() {
  return (
    <>
      <Hero />
      <About />
      <Features />
    </>
  );
}