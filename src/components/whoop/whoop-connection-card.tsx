import { disconnectWhoop } from "@/app/app/account/actions";

export default function WhoopConnectionCard({
  connectedAt,
  configured,
}: {
  connectedAt: Date | null;
  configured: boolean;
}) {
  const connected = connectedAt !== null;

  return (
    <section className="ui-card ui-head" aria-labelledby="whoop-connection-title">
      <div>
        <span className="ui-eyebrow">Wearable connection</span>
        <h2 id="whoop-connection-title" className="ui-title ui-title-md">WHOOP</h2>
        <p className="ui-sub">
          <strong>{connected ? "Connected" : "Not connected"}</strong>
          {connectedAt ? ` · since ${connectedAt.toLocaleDateString("en-GB", { dateStyle: "medium" })}` : " · connect securely. WHOOP data isn't shown on Home or Progress yet."}
        </p>
      </div>
      {connected ? (
        <form action={disconnectWhoop}>
          <button className="ui-btn ui-btn-ghost ui-btn-sm" type="submit">Disconnect</button>
        </form>
      ) : configured ? (
        <a className="ui-btn ui-btn-primary ui-btn-sm" href="/api/whoop/connect">Connect WHOOP</a>
      ) : (
        <button className="ui-btn ui-btn-ghost ui-btn-sm" type="button" disabled>Unavailable</button>
      )}
    </section>
  );
}
