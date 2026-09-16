"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { dives } from "@/db/schema";
import { requireCurrentUser } from "@/lib/auth-session";
import { parseDiveFormData, toDiveValues } from "@/lib/dive-validation";

export type DiveActionState = {
  error: string;
  fieldErrors: Partial<Record<
    | "diveDate"
    | "discipline"
    | "depthMeters"
    | "durationMinutes"
    | "durationRemainderSeconds"
    | "location"
    | "perceivedEffort"
    | "comfort"
    | "notes",
    string
  >>;
};

function invalidState(result: ReturnType<typeof parseDiveFormData>): DiveActionState {
  if (result.success) return { error: "", fieldErrors: {} };
  const errors = result.error.flatten().fieldErrors;
  return {
    error: "Please check the highlighted fields.",
    fieldErrors: Object.fromEntries(
      Object.entries(errors).map(([field, messages]) => [field, messages?.[0]]),
    ),
  };
}

export async function createDive(
  _previousState: DiveActionState,
  formData: FormData,
): Promise<DiveActionState> {
  const user = await requireCurrentUser();
  const result = parseDiveFormData(formData);
  if (!result.success) return invalidState(result);

  try {
    await db.insert(dives).values({ userId: user.id, ...toDiveValues(result.data) });
  } catch {
    return { error: "We could not save this dive. Please try again.", fieldErrors: {} };
  }

  revalidatePath("/app/log");
  redirect("/app/log");
}

export async function updateDive(
  diveId: string,
  _previousState: DiveActionState,
  formData: FormData,
): Promise<DiveActionState> {
  const user = await requireCurrentUser();
  const idResult = z.uuid().safeParse(diveId);
  const result = parseDiveFormData(formData);
  if (!idResult.success) return { error: "Dive not found.", fieldErrors: {} };
  if (!result.success) return invalidState(result);

  try {
    const updated = await db
      .update(dives)
      .set(toDiveValues(result.data))
      .where(and(eq(dives.id, idResult.data), eq(dives.userId, user.id)))
      .returning({ id: dives.id });

    if (updated.length === 0) return { error: "Dive not found.", fieldErrors: {} };
  } catch {
    return { error: "We could not update this dive. Please try again.", fieldErrors: {} };
  }

  revalidatePath("/app/log");
  revalidatePath(`/app/log/${idResult.data}`);
  redirect(`/app/log/${idResult.data}`);
}

export async function deleteDive(
  diveId: string,
  _previousState: { error?: string },
  _formData: FormData,
) {
  void _previousState;
  void _formData;
  const user = await requireCurrentUser();
  const idResult = z.uuid().safeParse(diveId);
  if (!idResult.success) return { error: "Dive not found." };

  const deleted = await db
    .delete(dives)
    .where(and(eq(dives.id, idResult.data), eq(dives.userId, user.id)))
    .returning({ id: dives.id });

  if (deleted.length === 0) return { error: "Dive not found." };

  revalidatePath("/app/log");
  redirect("/app/log");
}
