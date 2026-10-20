"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { performanceAssessments } from "@/db/schema";
import { requireCurrentUser } from "@/lib/auth-session";
import { PERFORMANCE_PROFILE_VERSION } from "@/lib/performance-profile/definitions";
import { scorePerformanceProfile } from "@/lib/performance-profile/scoring";
import { performanceProfileSubmissionSchema } from "@/lib/performance-profile/validation";

export type AssessmentActionState = { error: string };

function parseJson(value: FormDataEntryValue | null): unknown {
  if (typeof value !== "string") return {};
  try { return JSON.parse(value); } catch { return {}; }
}

export async function submitPerformanceProfile(
  _state: AssessmentActionState,
  formData: FormData,
): Promise<AssessmentActionState> {
  const user = await requireCurrentUser();
  const parsed = performanceProfileSubmissionSchema.safeParse({
    goal: formData.get("goal"),
    responses: parseJson(formData.get("responses")),
    stateResponses: parseJson(formData.get("stateResponses")),
    startedAt: formData.get("startedAt"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please complete every question before submitting." };
  }

  const result = scorePerformanceProfile(parsed.data.responses, parsed.data.stateResponses, parsed.data.goal);
  let assessmentId: string;
  try {
    const [assessment] = await db.insert(performanceAssessments).values({
      userId: user.id,
      version: PERFORMANCE_PROFILE_VERSION,
      status: "completed",
      goal: parsed.data.goal,
      responses: parsed.data.responses,
      stateResponses: parsed.data.stateResponses,
      result,
      startedAt: parsed.data.startedAt,
      completedAt: new Date(),
    }).returning({ id: performanceAssessments.id });
    assessmentId = assessment.id;
  } catch {
    return { error: "Your Performance Profile could not be saved. Please try again." };
  }

  revalidatePath("/app/performance-profile");
  revalidatePath("/app/train");
  revalidatePath("/app/progress");
  redirect(`/app/performance-profile?completed=${assessmentId}`);
}

