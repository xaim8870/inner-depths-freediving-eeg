"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { trainingSessions } from "@/db/schema";
import { requireCurrentUser } from "@/lib/auth-session";
import { parseTrainingFormData, toTrainingSessionValues } from "@/lib/training-validation";

export type TrainingActionState = {
  error: string;
  fieldErrors: Partial<Record<
    "sessionDate" | "sessionType" | "durationMinutes" | "difficulty" | "notes",
    string
  >>;
};

function invalidState(result: ReturnType<typeof parseTrainingFormData>): TrainingActionState {
  if (result.success) return { error: "", fieldErrors: {} };
  const errors = result.error.flatten().fieldErrors;
  return {
    error: "Please check the highlighted fields.",
    fieldErrors: Object.fromEntries(
      Object.entries(errors).map(([field, messages]) => [field, messages?.[0]]),
    ),
  };
}

export async function createTrainingSession(
  _previousState: TrainingActionState,
  formData: FormData,
): Promise<TrainingActionState> {
  const user = await requireCurrentUser();
  const result = parseTrainingFormData(formData);
  if (!result.success) return invalidState(result);

  try {
    await db
      .insert(trainingSessions)
      .values({ userId: user.id, ...toTrainingSessionValues(result.data) });
  } catch {
    return { error: "We could not save this training session. Please try again.", fieldErrors: {} };
  }

  revalidatePath("/app/train");
  revalidatePath("/app/home");
  redirect("/app/train");
}

export async function updateTrainingSession(
  sessionId: string,
  _previousState: TrainingActionState,
  formData: FormData,
): Promise<TrainingActionState> {
  const user = await requireCurrentUser();
  const idResult = z.uuid().safeParse(sessionId);
  const result = parseTrainingFormData(formData);
  if (!idResult.success) return { error: "Training session not found.", fieldErrors: {} };
  if (!result.success) return invalidState(result);

  try {
    const updated = await db
      .update(trainingSessions)
      .set(toTrainingSessionValues(result.data))
      .where(
        and(
          eq(trainingSessions.id, idResult.data),
          eq(trainingSessions.userId, user.id),
        ),
      )
      .returning({ id: trainingSessions.id });

    if (updated.length === 0) {
      return { error: "Training session not found.", fieldErrors: {} };
    }
  } catch {
    return { error: "We could not update this training session. Please try again.", fieldErrors: {} };
  }

  revalidatePath("/app/train");
  revalidatePath(`/app/train/${idResult.data}`);
  revalidatePath("/app/home");
  redirect(`/app/train/${idResult.data}`);
}

export async function deleteTrainingSession(
  sessionId: string,
  _previousState: { error?: string },
  _formData: FormData,
) {
  void _previousState;
  void _formData;
  const user = await requireCurrentUser();
  const idResult = z.uuid().safeParse(sessionId);
  if (!idResult.success) return { error: "Training session not found." };

  const deleted = await db
    .delete(trainingSessions)
    .where(
      and(
        eq(trainingSessions.id, idResult.data),
        eq(trainingSessions.userId, user.id),
      ),
    )
    .returning({ id: trainingSessions.id });

  if (deleted.length === 0) return { error: "Training session not found." };

  revalidatePath("/app/train");
  revalidatePath("/app/home");
  redirect("/app/train");
}
