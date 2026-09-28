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
    <section className="whoop-connection-card" aria-labelledby="whoop-connection-title">
      <div>
        <div className="whoop-connection-label">Wearable connection</div>
        <h2 id="whoop-connection-title">WHOOP</h2>
        <p className={connected ? "whoop-status connected" : "whoop-status"}>
          <span aria-hidden="true" />
          {connected ? "Connected" : "Not connected"}
        </p>
        {connectedAt ? (
          <p className="whoop-connection-detail">
            Connected {connectedAt.toLocaleDateString("en", { dateStyle: "medium" })}
          </p>
        ) : (
          <p className="whoop-connection-detail">
            Connect your account securely. WHOOP data is not shown on Home or Progress yet.
          </p>
        )}
      </div>

      {connected ? (
        <form action={disconnectWhoop}>
          <button className="whoop-button whoop-button-secondary" type="submit">
            Disconnect
          </button>
        </form>
      ) : configured ? (
        <a className="whoop-button" href="/api/whoop/connect">Connect WHOOP</a>
      ) : (
        <button className="whoop-button" type="button" disabled>Unavailable</button>
      )}
    </section>
  );
}
