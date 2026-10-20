import type { TrainingGoalId } from "@/lib/training-goals";

export type PersonalizedPlan = {
  dominantFocus: string;
  secondaryFocus: string | null;
  items: Array<{ id: string; title: string; detail: string }>;
  cognitiveTrainingProgram: string | null;
  neurofeedbackModule: string | null;
  explanation: string;
};

export type TrainingPlanResult =
  | { status: "ready"; plan: PersonalizedPlan }
  | { status: "unavailable"; reason: "performance_profile_not_completed" };

export interface TrainingPlanProvider {
  getPlan(input: { userId: string; goals: TrainingGoalId[] }): Promise<TrainingPlanResult>;
}

export const pendingPerformanceProfilePlan: TrainingPlanProvider = {
  async getPlan() { return { status: "unavailable", reason: "performance_profile_not_completed" }; },
};
