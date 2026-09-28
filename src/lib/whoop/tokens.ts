import "server-only";

import {
  claimWhoopRefreshLease,
  clearWhoopRefreshLease,
  deleteWhoopConnection,
  getWhoopConnectionForUser,
  updateWhoopConnectionTokens,
} from "@/db/whoop-connections";
import { decryptWhoopToken, encryptWhoopToken } from "@/lib/whoop/crypto";
import {
  refreshWhoopTokens,
  revokeWhoopAccess,
  WhoopOAuthError,
} from "@/lib/whoop/oauth";

const EXPIRY_MARGIN_MS = 60_000;

export class WhoopNotConnectedError extends Error {
  constructor() {
    super("WHOOP is not connected");
    this.name = "WhoopNotConnectedError";
  }
}

export class WhoopRefreshInProgressError extends Error {
  constructor() {
    super("WHOOP credentials are currently refreshing");
    this.name = "WhoopRefreshInProgressError";
  }
}

function tokenIsUsable(expiresAt: Date) {
  return expiresAt.getTime() > Date.now() + EXPIRY_MARGIN_MS;
}

async function waitForConcurrentRefresh(userId: string, previousAccessToken: string) {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const connection = await getWhoopConnectionForUser(userId);
    if (!connection) throw new WhoopNotConnectedError();
    if (
      connection.accessTokenEncrypted !== previousAccessToken
      && tokenIsUsable(connection.accessTokenExpiresAt)
    ) {
      return decryptWhoopToken(connection.accessTokenEncrypted);
    }
  }
  throw new WhoopRefreshInProgressError();
}

export async function getValidWhoopAccessToken(
  userId: string,
  options: { forceRefresh?: boolean } = {},
) {
  const connection = await getWhoopConnectionForUser(userId);
  if (!connection) throw new WhoopNotConnectedError();

  if (!options.forceRefresh && tokenIsUsable(connection.accessTokenExpiresAt)) {
    return decryptWhoopToken(connection.accessTokenEncrypted);
  }

  const claimedConnection = await claimWhoopRefreshLease(userId);
  if (!claimedConnection) {
    return waitForConcurrentRefresh(userId, connection.accessTokenEncrypted);
  }
  const refreshLeaseExpiresAt = claimedConnection.refreshLeaseExpiresAt;
  if (!refreshLeaseExpiresAt) throw new WhoopRefreshInProgressError();

  try {
    const refreshed = await refreshWhoopTokens(
      decryptWhoopToken(claimedConnection.refreshTokenEncrypted),
    );
    const accessTokenEncrypted = encryptWhoopToken(refreshed.access_token);
    const stored = await updateWhoopConnectionTokens({
      userId,
      refreshLeaseExpiresAt,
      accessTokenEncrypted,
      refreshTokenEncrypted: encryptWhoopToken(refreshed.refresh_token),
      accessTokenExpiresAt: new Date(Date.now() + refreshed.expires_in * 1000),
      scopes: refreshed.scope,
    });
    if (!stored) {
      await revokeWhoopAccess(refreshed.access_token).catch(() => false);
      throw new WhoopNotConnectedError();
    }
    return refreshed.access_token;
  } catch (error) {
    if (error instanceof WhoopOAuthError && [400, 401].includes(error.status)) {
      await deleteWhoopConnection(userId);
      throw new WhoopNotConnectedError();
    }
    await clearWhoopRefreshLease(userId, refreshLeaseExpiresAt);
    throw error;
  }
}
