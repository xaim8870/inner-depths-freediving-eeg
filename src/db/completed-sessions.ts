import "server-only";

import { and, desc, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { trainingSessions } from "@/db/schema";

export type CompletedSession = typeof trainingSessions.$inferSelect;

export function getCompletedSessionsForUser(userId: string) {
  return db.select().from(trainingSessions)
    .where(and(eq(trainingSessions.userId, userId), ne(trainingSessions.sessionCategory, "training")))
    .orderBy(desc(trainingSessions.sessionDate), desc(trainingSessions.createdAt));
}

export async function getCompletedSessionForUser(userId: string, sessionId: string) {
  const [session] = await db.select().from(trainingSessions)
    .where(and(eq(trainingSessions.userId, userId), eq(trainingSessions.id, sessionId), ne(trainingSessions.sessionCategory, "training")))
    .limit(1);
  return session ?? null;
}

