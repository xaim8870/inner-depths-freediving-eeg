export const trainingGoals = [
  { id: "calm_nerves", label: "Calm pre-dive nerves", description: "Build a steadier pre-dive state." },
  { id: "focus_attention", label: "Focus & attention", description: "Practice directing attention under pressure." },
  { id: "confidence", label: "Confidence & self-belief", description: "Support trust in your preparation." },
  { id: "dry_contractions", label: "Comfort with contractions — dry only", description: "Record a dry-land focus without in-water guidance." },
  { id: "flow", label: "Get into flow", description: "Develop a repeatable performance state." },
  { id: "consistency", label: "Consistency & routine", description: "Build a reliable pre-dive process." },
] as const;
export type TrainingGoalId = (typeof trainingGoals)[number]["id"];
export const trainingGoalIds = trainingGoals.map((goal) => goal.id) as [TrainingGoalId, ...TrainingGoalId[]];
export const trainingGoalSelectionSchema = z.array(z.enum(trainingGoalIds)).max(3, "Choose no more than three goals.");
import { z } from "zod";
