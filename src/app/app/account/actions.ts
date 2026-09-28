"use server";

import { redirect } from "next/navigation";
import { deleteWhoopConnection, getWhoopConnectionForUser } from "@/db/whoop-connections";
import { requireCurrentUser } from "@/lib/auth-session";
import { revokeWhoopAccess } from "@/lib/whoop/oauth";
import { getValidWhoopAccessToken } from "@/lib/whoop/tokens";

export async function disconnectWhoop() {
  const user = await requireCurrentUser();
  const connection = await getWhoopConnectionForUser(user.id);
  if (!connection) redirect("/app/account");

  try {
    const accessToken = await getValidWhoopAccessToken(user.id);
    const revoked = await revokeWhoopAccess(accessToken);
    if (!revoked) console.warn("WHOOP access revocation was not acknowledged");
  } catch {
    console.warn("WHOOP access could not be revoked before local disconnect");
  } finally {
    await deleteWhoopConnection(user.id);
  }

  redirect("/app/account?whoop=disconnected");
}
