import "server-only";

import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { trainingSessions } from "@/db/schema";

export type TrainingSession = typeof trainingSessions.$inferSelect;

export async function getTrainingSessionsForUser(userId: string) {
  return db
    .select()
    .from(trainingSessions)
    .where(eq(trainingSessions.userId, userId))
    .orderBy(desc(trainingSessions.sessionDate), desc(trainingSessions.createdAt));
}

export async function getTrainingSessionForUser(userId: string, sessionId: string) {
  const [session] = await db
    .select()
    .from(trainingSessions)
    .where(and(eq(trainingSessions.id, sessionId), eq(trainingSessions.userId, userId)))
    .limit(1);

  return session ?? null;
}

export async function getHomeTrainingSummary(userId: string) {
  const [countRows, latestRows] = await Promise.all([
    db
      .select({
        sessionsLast30Days: sql<number>`count(*) filter (
          where ${trainingSessions.sessionDate} >= current_date - 29
        )`.mapWith(Number),
      })
      .from(trainingSessions)
      .where(eq(trainingSessions.userId, userId)),
    db
      .select()
      .from(trainingSessions)
      .where(eq(trainingSessions.userId, userId))
      .orderBy(desc(trainingSessions.sessionDate), desc(trainingSessions.createdAt))
      .limit(1),
  ]);

  return {
    sessionsLast30Days: countRows[0]?.sessionsLast30Days ?? 0,
    latestSession: latestRows[0] ?? null,
  };
}
