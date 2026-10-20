import { z } from "zod";
import { assessmentGoals, assessmentItems, stateItems, styleItems } from "./definitions.ts";

const ratingMap = z.record(z.string(), z.number().int().min(1).max(5));

export const performanceProfileSubmissionSchema = z.object({
  goal: z.enum(assessmentGoals.map((goal) => goal.id) as [typeof assessmentGoals[number]["id"], ...typeof assessmentGoals[number]["id"][]]),
  responses: ratingMap,
  stateResponses: ratingMap,
  startedAt: z.coerce.date(),
}).superRefine((value, context) => {
  for (const item of [...assessmentItems, ...styleItems]) {
    if (value.responses[item.id] === undefined) {
      context.addIssue({ code: "custom", path: ["responses", item.id], message: "Please answer every statement before submitting." });
    }
  }
  for (const item of stateItems) {
    if (value.stateResponses[item.id] === undefined) {
      context.addIssue({ code: "custom", path: ["stateResponses", item.id], message: "Please complete every current-state rating." });
    }
  }
  if (value.startedAt.getTime() > Date.now()) {
    context.addIssue({ code: "custom", path: ["startedAt"], message: "Assessment start time is invalid." });
  }
});

export type PerformanceProfileSubmission = z.infer<typeof performanceProfileSubmissionSchema>;
