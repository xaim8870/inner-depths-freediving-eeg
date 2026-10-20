import "server-only";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { trainingGoals } from "@/db/schema";

export function getTrainingGoalsForUser(userId: string) {
  return db.select().from(trainingGoals).where(eq(trainingGoals.userId, userId)).orderBy(asc(trainingGoals.position));
}

