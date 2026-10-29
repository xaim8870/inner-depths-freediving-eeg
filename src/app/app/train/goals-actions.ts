"use server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { trainingGoals as trainingGoalsTable } from "@/db/schema";
import { requireCurrentUser } from "@/lib/auth-session";
import { trainingGoalSelectionSchema } from "@/lib/training-goals";

export type GoalActionState = { error: string; saved: boolean };

export async function saveTrainingGoals(_state: GoalActionState, formData: FormData): Promise<GoalActionState> {
  const user = await requireCurrentUser();
  const result = trainingGoalSelectionSchema.safeParse(formData.getAll("goals"));
  if (!result.success) return { error: result.error.issues[0]?.message ?? "Choose up to three goals.", saved: false };
  try {
    // neon-http has no interactive transactions (db.transaction throws); db.batch runs
    // these statements in one HTTP request as a single atomic transaction.
    const clear = db.delete(trainingGoalsTable).where(eq(trainingGoalsTable.userId, user.id));
    if (result.data.length) {
      await db.batch([clear, db.insert(trainingGoalsTable).values(result.data.map((goal, position) => ({ userId: user.id, goal, position })))]);
    } else {
      await clear;
    }
  } catch {
    return { error: "Your goals could not be saved. Please try again.", saved: false };
  }
  revalidatePath("/app/train"); revalidatePath("/app/home");
  return { error: "", saved: true };
}
