"use server";

import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { trainingSessions } from "@/db/schema";
import { requireCurrentUser } from "@/lib/auth-session";
import { parseCompletedSessionFormData, toCompletedSessionValues, type CompletedSessionInput } from "@/lib/completed-session-validation";

export type CompletedSessionActionState = {
  error: string;
  fieldErrors: Partial<Record<keyof CompletedSessionInput, string>>;
};

function invalidState(result: ReturnType<typeof parseCompletedSessionFormData>): CompletedSessionActionState {
  if (result.success) return { error: "", fieldErrors: {} };
  return {
    error: "Please check the highlighted fields.",
    fieldErrors: Object.fromEntries(Object.entries(result.error.flatten().fieldErrors).map(([key, messages]) => [key, messages?.[0]])),
  };
}

export async function createCompletedSession(_state: CompletedSessionActionState, formData: FormData): Promise<CompletedSessionActionState> {
  const user = await requireCurrentUser();
  const result = parseCompletedSessionFormData(formData);
  if (!result.success) return invalidState(result);
  try {
    await db.insert(trainingSessions).values({ userId: user.id, ...toCompletedSessionValues(result.data) });
  } catch {
    return { error: "We could not save this completed session. Please try again.", fieldErrors: {} };
  }
  revalidatePath("/app/log"); revalidatePath("/app/train"); revalidatePath("/app/home"); revalidatePath("/app/progress");
  redirect("/app/log?saved=session");
}

export async function updateCompletedSession(id: string, _state: CompletedSessionActionState, formData: FormData): Promise<CompletedSessionActionState> {
  const user = await requireCurrentUser();
  const parsedId = z.uuid().safeParse(id);
  const result = parseCompletedSessionFormData(formData);
  if (!parsedId.success) return { error: "Session not found.", fieldErrors: {} };
  if (!result.success) return invalidState(result);
  const updated = await db.update(trainingSessions).set(toCompletedSessionValues(result.data))
    .where(and(eq(trainingSessions.id, parsedId.data), eq(trainingSessions.userId, user.id), ne(trainingSessions.sessionCategory, "training")))
    .returning({ id: trainingSessions.id });
  if (!updated.length) return { error: "Session not found.", fieldErrors: {} };
  revalidatePath("/app/log"); revalidatePath(`/app/log/sessions/${id}`); revalidatePath("/app/home"); revalidatePath("/app/progress");
  redirect(`/app/log/sessions/${id}?saved=1`);
}

export async function deleteCompletedSession(id: string, _state: { error?: string }, _formData: FormData) {
  void _state; void _formData;
  const user = await requireCurrentUser();
  const parsedId = z.uuid().safeParse(id);
  if (!parsedId.success) return { error: "Session not found." };
  const deleted = await db.delete(trainingSessions)
    .where(and(eq(trainingSessions.id, parsedId.data), eq(trainingSessions.userId, user.id), ne(trainingSessions.sessionCategory, "training")))
    .returning({ id: trainingSessions.id });
  if (!deleted.length) return { error: "Session not found." };
  revalidatePath("/app/log"); revalidatePath("/app/train"); revalidatePath("/app/home"); revalidatePath("/app/progress");
  redirect("/app/log");
}
