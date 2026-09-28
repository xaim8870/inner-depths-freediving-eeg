import Link from "next/link";
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

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ whoop?: string }>;
}) {
  const user = await requireCurrentUser();
  const [connection, params] = await Promise.all([
    getWhoopConnectionStatus(user.id),
    searchParams,
  ]);
  const message = params.whoop ? messages[params.whoop] : undefined;

  return (
    <section className="account-page">
      <header className="account-page-header">
        <div className="account-eyebrow">Account</div>
        <h1>Connections</h1>
        <p>Manage services connected to your Inner Depths account.</p>
      </header>

      {message ? <p className="account-status-message" role="status">{message}</p> : null}

      <WhoopConnectionCard
        connectedAt={connection?.connectedAt ?? null}
        configured={isWhoopConfigured()}
      />

      <div className="account-page-links">
        <Link className="account-back-link" href="/app/home">Return to Home</Link>
        <Link className="account-privacy-link" href="/privacy">Privacy Policy</Link>
      </div>
    </section>
  );
}
