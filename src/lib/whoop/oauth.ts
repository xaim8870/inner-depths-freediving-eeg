import "server-only";

import { z } from "zod";
import {
  getWhoopConfig,
  WHOOP_API_BASE_URL,
  WHOOP_TOKEN_URL,
} from "@/lib/whoop/config";

const tokenResponseSchema = z.object({
  access_token: z.string().min(1),
  refresh_token: z.string().min(1),
  expires_in: z.number().int().positive(),
  scope: z.string().min(1),
  token_type: z.string().min(1),
});

const profileSchema = z.object({
  user_id: z.union([z.number(), z.string()]).transform(String),
  email: z.string().email().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
});

export type WhoopTokenResponse = z.infer<typeof tokenResponseSchema>;
export type WhoopProfile = z.infer<typeof profileSchema>;

export class WhoopOAuthError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string,
  ) {
    super(message);
    this.name = "WhoopOAuthError";
  }
}

async function requestTokens(body: URLSearchParams) {
  const response = await fetch(WHOOP_TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const code = z.object({ error: z.string().optional() }).safeParse(payload);
    throw new WhoopOAuthError(
      "WHOOP token request failed",
      response.status,
      code.success ? code.data.error ?? "token_request_failed" : "token_request_failed",
    );
  }

  const result = tokenResponseSchema.safeParse(payload);
  if (!result.success) {
    throw new WhoopOAuthError("WHOOP returned an invalid token response", 502, "invalid_response");
  }
  return result.data;
}

export function exchangeWhoopAuthorizationCode(code: string) {
  const config = getWhoopConfig();
  return requestTokens(new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: config.redirectUri,
  }));
}

export function refreshWhoopTokens(refreshToken: string) {
  const config = getWhoopConfig();
  return requestTokens(new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    scope: "offline",
  }));
}

export async function getWhoopProfileWithToken(accessToken: string) {
  const response = await fetch(`${WHOOP_API_BASE_URL}/user/profile/basic`, {
    headers: { authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new WhoopOAuthError("WHOOP profile request failed", response.status, "profile_request_failed");
  }

  const result = profileSchema.safeParse(await response.json().catch(() => null));
  if (!result.success) {
    throw new WhoopOAuthError("WHOOP returned an invalid profile", 502, "invalid_profile");
  }
  return result.data;
}

export async function revokeWhoopAccess(accessToken: string) {
  const response = await fetch(`${WHOOP_API_BASE_URL}/user/access`, {
    method: "DELETE",
    headers: { authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  return response.status === 204;
}
