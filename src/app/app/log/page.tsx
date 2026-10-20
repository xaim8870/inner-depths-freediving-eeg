import Link from "next/link";
import SessionHistory from "@/components/log/session-history";
import { getDivesForUser } from "@/db/dives";
import { getCompletedSessionsForUser } from "@/db/completed-sessions";
import { requireCurrentUser } from "@/lib/auth-session";

const types = [
  { id: "dive", label: "Dive", href: "/app/log/new" },
  { id: "pool", label: "Pool", href: "/app/log/sessions/new?type=pool" },
  { id: "dry_hold", label: "Dry hold", href: "/app/log/sessions/new?type=dry_hold" },
  { id: "table", label: "Table", href: "/app/log/sessions/new?type=table" },
] as const;

export default async function LogPage({ searchParams }: { searchParams: Promise<{ type?: string; saved?: string }> }) {
  const user = await requireCurrentUser();
  const [dives, sessions, params] = await Promise.all([getDivesForUser(user.id), getCompletedSessionsForUser(user.id), searchParams]);
  const filter = ["all", ...types.map((type) => type.id)].includes(params.type ?? "all") ? params.type ?? "all" : "all";

  return (
    <section className="dive-log-page">
      <header className="dive-page-header">
        <div>
          <div className="dive-eyebrow">Completed sessions</div>
          <h1>Session Log</h1>
          <p>Record what already happened. This log never prescribes a session.</p>
        </div>
      </header>
      {params.saved ? <p className="save-success save-banner" role="status">{params.saved === "dive" ? "Dive" : "Session"} saved to your log.</p> : null}

      <div className="dive-safety-note">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
        <span>Dives require buddy safety. Pool, dry-hold, and table records require supervision attestation.</span>
      </div>

      <div className="session-type-grid" aria-label="Add completed session">
        {types.map((type) => <Link key={type.id} href={type.href} className="session-type-card"><span aria-hidden="true">+</span><strong>{type.label}</strong></Link>)}
      </div>

      {(dives.length || sessions.length) ? (
        <div className="dive-history-section">
          <div className="section-title-row"><h2>History</h2><span>{dives.length + sessions.length} logged</span></div>
          <nav className="history-filters" aria-label="Filter session history">
            {[{ id: "all", label: "All" }, ...types].map((type) => <Link key={type.id} href={type.id === "all" ? "/app/log" : `/app/log?type=${type.id}`} className={filter === type.id ? "active" : ""}>{type.label}</Link>)}
          </nav>
          <SessionHistory dives={dives} sessions={sessions} filter={filter} />
        </div>
      ) : <div className="session-empty-state"><h2>Your log starts here</h2><p>Add a dive or completed training session. Your history and descriptive patterns will build from real records.</p><Link href="/app/log/new" className="dive-button dive-button-primary">Log your first dive</Link></div>}
    </section>
  );
}
