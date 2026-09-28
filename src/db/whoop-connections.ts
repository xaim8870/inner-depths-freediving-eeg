import "server-only";

import { and, eq, isNull, lt, or } from "drizzle-orm";
import { db } from "@/db";
import { whoopConnections } from "@/db/schema";

export type WhoopConnection = typeof whoopConnections.$inferSelect;

export async function getWhoopConnectionForUser(userId: string) {
  const [connection] = await db
    .select()
    .from(whoopConnections)
    .where(eq(whoopConnections.userId, userId))
    .limit(1);
  return connection ?? null;
}

export async function getWhoopConnectionStatus(userId: string) {
  const [connection] = await db
    .select({
      connectedAt: whoopConnections.connectedAt,
      scopes: whoopConnections.scopes,
    })
    .from(whoopConnections)
    .where(eq(whoopConnections.userId, userId))
    .limit(1);
  return connection ?? null;
}

export async function saveWhoopConnection({
  userId,
  whoopUserId,
  accessTokenEncrypted,
  refreshTokenEncrypted,
  accessTokenExpiresAt,
  scopes,
}: {
  userId: string;
  whoopUserId: string;
  accessTokenEncrypted: string;
  refreshTokenEncrypted: string;
  accessTokenExpiresAt: Date;
  scopes: string;
}) {
  const now = new Date();
  await db
    .insert(whoopConnections)
    .values({
      userId,
      whoopUserId,
      accessTokenEncrypted,
      refreshTokenEncrypted,
      accessTokenExpiresAt,
      scopes,
      connectedAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: whoopConnections.userId,
      set: {
        whoopUserId,
        accessTokenEncrypted,
        refreshTokenEncrypted,
        accessTokenExpiresAt,
        scopes,
        refreshLeaseExpiresAt: null,
        connectedAt: now,
        updatedAt: now,
      },
    });
}

export async function claimWhoopRefreshLease(userId: string) {
  const now = new Date();
  const [connection] = await db
    .update(whoopConnections)
    .set({
      refreshLeaseExpiresAt: new Date(now.getTime() + 30_000),
      updatedAt: now,
    })
    .where(and(
      eq(whoopConnections.userId, userId),
      or(
        isNull(whoopConnections.refreshLeaseExpiresAt),
        lt(whoopConnections.refreshLeaseExpiresAt, now),
      ),
    ))
    .returning();
  return connection ?? null;
}

export async function updateWhoopConnectionTokens({
  userId,
  refreshLeaseExpiresAt,
  accessTokenEncrypted,
  refreshTokenEncrypted,
  accessTokenExpiresAt,
  scopes,
}: {
  userId: string;
  refreshLeaseExpiresAt: Date;
  accessTokenEncrypted: string;
  refreshTokenEncrypted: string;
  accessTokenExpiresAt: Date;
  scopes: string;
}) {
  const [connection] = await db
    .update(whoopConnections)
    .set({
      accessTokenEncrypted,
      refreshTokenEncrypted,
      accessTokenExpiresAt,
      scopes,
      refreshLeaseExpiresAt: null,
      updatedAt: new Date(),
    })
    .where(and(
      eq(whoopConnections.userId, userId),
      eq(whoopConnections.refreshLeaseExpiresAt, refreshLeaseExpiresAt),
    ))
    .returning({ id: whoopConnections.id });
  return connection !== undefined;
}

export async function clearWhoopRefreshLease(userId: string, refreshLeaseExpiresAt: Date) {
  await db
    .update(whoopConnections)
    .set({ refreshLeaseExpiresAt: null, updatedAt: new Date() })
    .where(and(
      eq(whoopConnections.userId, userId),
      eq(whoopConnections.refreshLeaseExpiresAt, refreshLeaseExpiresAt),
    ));
}

export async function deleteWhoopConnection(userId: string) {
  await db.delete(whoopConnections).where(eq(whoopConnections.userId, userId));
}
