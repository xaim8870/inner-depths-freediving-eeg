import "server-only";

import { randomBytes } from "node:crypto";
import { z } from "zod";
import { signaturesMatch, signWhoopStatePayload } from "@/lib/whoop/crypto";

export const WHOOP_STATE_COOKIE = "inner_depths_whoop_oauth";
export const WHOOP_STATE_MAX_AGE_SECONDS = 10 * 60;

const statePayloadSchema = z.object({
  state: z.string().min(8),
  userId: z.string().uuid(),
  expiresAt: z.number().int().positive(),
});

export function createWhoopOAuthState(userId: string) {
  const state = randomBytes(32).toString("base64url");
  const payload = Buffer.from(JSON.stringify({
    state,
    userId,
    expiresAt: Date.now() + WHOOP_STATE_MAX_AGE_SECONDS * 1000,
  })).toString("base64url");
  const signature = signWhoopStatePayload(payload);

  return { state, cookieValue: `${payload}.${signature}` };
}

export function verifyWhoopOAuthState({
  cookieValue,
  returnedState,
  userId,
}: {
  cookieValue: string | undefined;
  returnedState: string | null;
  userId: string;
}) {
  if (!cookieValue || !returnedState) return false;
  const [payload, signature, ...extra] = cookieValue.split(".");
  if (!payload || !signature || extra.length > 0) return false;

  const expectedSignature = signWhoopStatePayload(payload);
  if (!signaturesMatch(signature, expectedSignature)) return false;

  try {
    const result = statePayloadSchema.safeParse(
      JSON.parse(Buffer.from(payload, "base64url").toString("utf8")),
    );
    if (!result.success) return false;

    return result.data.expiresAt >= Date.now()
      && result.data.userId === userId
      && signaturesMatch(result.data.state, returnedState);
  } catch {
    return false;
  }
}
