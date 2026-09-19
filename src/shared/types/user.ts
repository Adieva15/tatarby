export type AgeGroup = "child" | "teen" | "adult";
export type Level = "A1" | "A2" | "B1" | "B2" | "C1";

export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  ageGroup: AgeGroup;
  level: Level;
  streakDays: number;
}

export interface Progress {
  textsRead: number;
  avgComprehension: number;
  history: { date: string; level: Level }[];
}