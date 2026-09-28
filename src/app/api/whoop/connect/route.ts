import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth-session";
import {
  getWhoopConfig,
  WHOOP_AUTHORIZATION_URL,
  WHOOP_SCOPES,
} from "@/lib/whoop/config";
import {
  createWhoopOAuthState,
  WHOOP_STATE_COOKIE,
  WHOOP_STATE_MAX_AGE_SECONDS,
} from "@/lib/whoop/oauth-state";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.redirect(new URL("/sign-in", request.url));

  let config;
  try {
    config = getWhoopConfig();
  } catch {
    return NextResponse.redirect(new URL("/app/account?whoop=unavailable", request.url));
  }

  const { state, cookieValue } = createWhoopOAuthState(user.id);
  const authorizationUrl = new URL(WHOOP_AUTHORIZATION_URL);
  authorizationUrl.searchParams.set("client_id", config.clientId);
  authorizationUrl.searchParams.set("redirect_uri", config.redirectUri);
  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set("scope", WHOOP_SCOPES.join(" "));
  authorizationUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(authorizationUrl);
  response.cookies.set(WHOOP_STATE_COOKIE, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/whoop/callback",
    maxAge: WHOOP_STATE_MAX_AGE_SECONDS,
  });
  return response;
}
