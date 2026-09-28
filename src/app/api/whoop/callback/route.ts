import { NextResponse, type NextRequest } from "next/server";
import { saveWhoopConnection } from "@/db/whoop-connections";
import { getCurrentUser } from "@/lib/auth-session";
import { encryptWhoopToken } from "@/lib/whoop/crypto";
import {
  exchangeWhoopAuthorizationCode,
  getWhoopProfileWithToken,
  revokeWhoopAccess,
  WhoopOAuthError,
} from "@/lib/whoop/oauth";
import { verifyWhoopOAuthState, WHOOP_STATE_COOKIE } from "@/lib/whoop/oauth-state";

function clearStateCookie(response: NextResponse) {
  response.cookies.set(WHOOP_STATE_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/whoop/callback",
    maxAge: 0,
  });
  return response;
}

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return clearStateCookie(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }

  const params = request.nextUrl.searchParams;
  const validState = verifyWhoopOAuthState({
    cookieValue: request.cookies.get(WHOOP_STATE_COOKIE)?.value,
    returnedState: params.get("state"),
    userId: user.id,
  });
  if (!validState) {
    return clearStateCookie(NextResponse.json({ error: "Invalid OAuth state" }, { status: 400 }));
  }

  if (params.has("error")) {
    return clearStateCookie(
      NextResponse.redirect(new URL("/app/account?whoop=denied", request.url)),
    );
  }

  const code = params.get("code");
  if (!code) {
    return clearStateCookie(NextResponse.json({ error: "Invalid OAuth callback" }, { status: 400 }));
  }

  let issuedAccessToken: string | null = null;
  try {
    const tokens = await exchangeWhoopAuthorizationCode(code);
    issuedAccessToken = tokens.access_token;
    const profile = await getWhoopProfileWithToken(tokens.access_token);
    await saveWhoopConnection({
      userId: user.id,
      whoopUserId: profile.user_id,
      accessTokenEncrypted: encryptWhoopToken(tokens.access_token),
      refreshTokenEncrypted: encryptWhoopToken(tokens.refresh_token),
      accessTokenExpiresAt: new Date(Date.now() + tokens.expires_in * 1000),
      scopes: tokens.scope,
    });

    return clearStateCookie(
      NextResponse.redirect(new URL("/app/account?whoop=connected", request.url)),
    );
  } catch (error) {
    if (issuedAccessToken) await revokeWhoopAccess(issuedAccessToken).catch(() => false);
    console.error("WHOOP OAuth callback failed", {
      reason: error instanceof WhoopOAuthError ? error.code : "connection_failed",
    });
    return clearStateCookie(
      NextResponse.redirect(new URL("/app/account?whoop=error", request.url)),
    );
  }
}
