import "server-only";

export const WHOOP_AUTHORIZATION_URL = "https://api.prod.whoop.com/oauth/oauth2/auth";
export const WHOOP_TOKEN_URL = "https://api.prod.whoop.com/oauth/oauth2/token";
export const WHOOP_API_BASE_URL = "https://api.prod.whoop.com/developer/v2";

export const WHOOP_SCOPES = [
  "offline",
  "read:profile",
  "read:recovery",
  "read:sleep",
  "read:cycles",
  "read:workout",
] as const;

export class WhoopConfigurationError extends Error {
  constructor() {
    super("WHOOP integration is not configured");
    this.name = "WhoopConfigurationError";
  }
}

export function isWhoopConfigured() {
  try {
    getWhoopConfig();
    return true;
  } catch {
    return false;
  }
}

export function getWhoopConfig() {
  const clientId = process.env.WHOOP_CLIENT_ID;
  const clientSecret = process.env.WHOOP_CLIENT_SECRET;
  const redirectUri = process.env.WHOOP_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri || !process.env.WHOOP_TOKEN_ENCRYPTION_KEY) {
    throw new WhoopConfigurationError();
  }

  let redirectUrl: URL;
  try {
    redirectUrl = new URL(redirectUri);
  } catch {
    throw new WhoopConfigurationError();
  }

  const secureRedirect = redirectUrl.protocol === "https:";
  const localRedirect = redirectUrl.protocol === "http:"
    && redirectUrl.hostname === "localhost";
  if (
    (!secureRedirect && !localRedirect)
    || redirectUrl.pathname !== "/api/whoop/callback"
    || redirectUrl.search !== ""
    || redirectUrl.hash !== ""
    || redirectUrl.username !== ""
    || redirectUrl.password !== ""
  ) {
    throw new WhoopConfigurationError();
  }

  return {
    clientId,
    clientSecret,
    redirectUri: redirectUrl.toString(),
  };
}
