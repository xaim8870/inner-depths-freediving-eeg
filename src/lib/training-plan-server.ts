import "server-only";

import { getLatestPerformanceAssessment } from "@/db/performance-assessments";
import type { TrainingPlanProvider } from "@/lib/training-plan";

const programNames: Record<string, string> = {
  nerves: "Dive-day nerves", confidence: "Confidence & self-belief", fear: "Fear & avoidance",
  panic: "Body sensations & panic literacy", focus: "Focus & overthinking",
  setback: "Setback recovery", foundational: "Foundational mental skills",
};

export const performanceProfilePlanProvider: TrainingPlanProvider = {
  async getPlan({ userId }) {
    const assessment = await getLatestPerformanceAssessment(userId);
    if (!assessment) return { status: "unavailable", reason: "performance_profile_not_completed" };
    const result = assessment.result;
    return {
      status: "ready",
      plan: {
        dominantFocus: result.pathways.blend ? "Balanced foundation" : result.dominant.label,
        secondaryFocus: result.pathways.ranked[1]?.label ?? null,
        items: [{
          id: result.plan.program,
          title: programNames[result.plan.program] ?? result.plan.program,
          detail: result.plan.note,
        }],
        cognitiveTrainingProgram: result.plan.program,
        neurofeedbackModule: result.plan.neurofeedback,
        explanation: result.dominant.lead,
      },
    };
  },
};

