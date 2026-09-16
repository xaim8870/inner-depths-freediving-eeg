import "server-only";

import { and, count, desc, eq, max, sql } from "drizzle-orm";
import { db } from "@/db";
import { dives } from "@/db/schema";

export type Dive = typeof dives.$inferSelect;

export async function getDivesForUser(userId: string) {
  return db
    .select()
    .from(dives)
    .where(eq(dives.userId, userId))
    .orderBy(desc(dives.diveDate), desc(dives.createdAt));
}

export async function getDiveForUser(userId: string, diveId: string) {
  const [dive] = await db
    .select()
    .from(dives)
    .where(and(eq(dives.id, diveId), eq(dives.userId, userId)))
    .limit(1);

  return dive ?? null;
}

export async function getHomeDiveDashboard(userId: string) {
  const [summaryRows, recentDives] = await Promise.all([
    db
      .select({
        totalDives: count(),
        deepestDive: max(dives.depthMeters),
        divesLast30Days: sql<number>`count(*) filter (
          where ${dives.diveDate} >= current_date - 29
        )`.mapWith(Number),
        averageComfort: sql<number | null>`avg(${dives.comfort})`.mapWith((value) =>
          value === null ? null : Number(value),
        ),
      })
      .from(dives)
      .where(eq(dives.userId, userId)),
    db
      .select()
      .from(dives)
      .where(eq(dives.userId, userId))
      .orderBy(desc(dives.diveDate), desc(dives.createdAt))
      .limit(3),
  ]);

  const summary = summaryRows[0] ?? {
    totalDives: 0,
    deepestDive: null,
    divesLast30Days: 0,
    averageComfort: null,
  };

  return {
    ...summary,
    latestDive: recentDives[0] ?? null,
    recentDives,
  };
}
