import "server-only";

import { WHOOP_API_BASE_URL } from "@/lib/whoop/config";
import { getValidWhoopAccessToken } from "@/lib/whoop/tokens";

export class WhoopApiError extends Error {
  constructor(public readonly status: number) {
    super("WHOOP API request failed");
    this.name = "WhoopApiError";
  }
}

async function requestWhoopApi(
  accessToken: string,
  path: string,
  init: Omit<RequestInit, "headers"> & { headers?: HeadersInit },
) {
  if (!path.startsWith("/")) throw new Error("WHOOP API paths must begin with a slash");
  const headers = new Headers(init.headers);
  headers.set("authorization", `Bearer ${accessToken}`);
  headers.set("accept", "application/json");

  return fetch(`${WHOOP_API_BASE_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
}

export async function whoopApiRequest<T>(
  userId: string,
  path: string,
  init: Omit<RequestInit, "headers"> & { headers?: HeadersInit } = {},
) {
  let accessToken = await getValidWhoopAccessToken(userId);
  let response = await requestWhoopApi(accessToken, path, init);

  if (response.status === 401) {
    accessToken = await getValidWhoopAccessToken(userId, { forceRefresh: true });
    response = await requestWhoopApi(accessToken, path, init);
  }

  if (!response.ok) throw new WhoopApiError(response.status);
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
