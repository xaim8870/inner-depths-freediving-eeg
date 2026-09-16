import "server-only";

import { and, desc, eq } from "drizzle-orm";
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
