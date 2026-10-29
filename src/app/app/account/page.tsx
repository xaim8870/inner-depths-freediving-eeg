import Link from "next/link";
import { PageHead } from "@/components/ui/page";
import WhoopConnectionCard from "@/components/whoop/whoop-connection-card";
import { getWhoopConnectionStatus } from "@/db/whoop-connections";
import { requireCurrentUser } from "@/lib/auth-session";
import { isWhoopConfigured } from "@/lib/whoop/config";

const messages: Record<string, string> = {
  connected: "Your WHOOP account is connected.",
  denied: "WHOOP authorization was cancelled. Nothing was connected.",
  disconnected: "Your WHOOP connection was removed.",
  error: "WHOOP could not be connected. Please try again.",
  unavailable: "WHOOP connection is not configured for this environment.",
};

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ whoop?: string }> }) {
  const user = await requireCurrentUser();
  const [connection, params] = await Promise.all([getWhoopConnectionStatus(user.id), searchParams]);
  const message = params.whoop ? messages[params.whoop] : undefined;

  return (
    <div className="ui-page ui-page-narrow">
      <PageHead eyebrow="Your body · connected devices" title="Connections" sub="Manage services connected to your Inner Depths account." />
      {message ? <p className="ui-banner" role="status">{message}</p> : null}
      <WhoopConnectionCard connectedAt={connection?.connectedAt ?? null} configured={isWhoopConfigured()} />
      <div className="ui-actions">
        <Link className="ui-link" href="/app/profile">Profile</Link>
        <Link className="ui-link" href="/privacy">Privacy policy</Link>
      </div>
    </div>
  );
}
