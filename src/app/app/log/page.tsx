import Link from "next/link";
import SessionHistory from "@/components/log/session-history";
import { Icon } from "@/components/ui/icons";
import { PageHead, SafetyNote, Section } from "@/components/ui/page";
import { getCompletedSessionsForUser } from "@/db/completed-sessions";
import { getDivesForUser } from "@/db/dives";
import { requireCurrentUser } from "@/lib/auth-session";

const others = [
  { id: "pool", label: "Pool", href: "/app/log/sessions/new?type=pool" },
  { id: "dry_hold", label: "Dry hold", href: "/app/log/sessions/new?type=dry_hold" },
  { id: "table", label: "Table", href: "/app/log/sessions/new?type=table" },
] as const;
const filterLabels: Record<string, string> = { all: "All", dive: "Dive", pool: "Pool", dry_hold: "Dry hold", table: "Table" };

export default async function LogPage({ searchParams }: { searchParams: Promise<{ type?: string; saved?: string }> }) {
  const user = await requireCurrentUser();
  const [dives, sessions, params] = await Promise.all([getDivesForUser(user.id), getCompletedSessionsForUser(user.id), searchParams]);
  const total = dives.length + sessions.length;
  // only offer filters for types the user has actually logged
  const present = ["dive", ...others.map((o) => o.id)].filter((id) => (id === "dive" ? dives.length : sessions.some((s) => s.sessionCategory === id)));
  const filter = present.includes(params.type ?? "") ? params.type! : "all";

  return (
    <div className="ui-page">
      <PageHead eyebrow="New entry" title="Log a session" sub="Record what already happened — this log never prescribes a session." />
      {params.saved ? <p className="ui-banner" role="status">{params.saved === "dive" ? "Dive" : "Session"} saved to your log.</p> : null}

      <Link href="/app/log/new" className="ui-primary-card">
        <span><Icon name="drop" size={24} /></span>
        <span><strong>Log a dive</strong><small>4 quick steps · about 2 minutes</small></span>
        <Icon name="next" />
      </Link>
      <p className="ui-secondary-links">
        <span>Something else?</span>
        {others.map((o) => <Link key={o.id} href={o.href} className="ui-link">{o.label}</Link>)}
      </p>

      {total ? (
        <Section label="History" aside={<span className="ui-pill">{total} logged</span>}>
          {present.length > 1 ? (
            <nav className="ui-tags" aria-label="Filter history">
              {["all", ...present].map((id) => (
                <Link key={id} href={id === "all" ? "/app/log" : `/app/log?type=${id}`} className="ui-choice" aria-current={filter === id ? "true" : undefined}>
                  <span className={filter === id ? "ui-choice-on" : undefined}>{filterLabels[id]}</span>
                </Link>
              ))}
            </nav>
          ) : null}
          <SessionHistory dives={dives} sessions={sessions} filter={filter} />
        </Section>
      ) : (
        <p className="ui-sub">Your history appears here once you log something.</p>
      )}

      <SafetyNote>Log only dives completed with a buddy and safety in place. Pool, dry-hold and table records need supervision.</SafetyNote>
    </div>
  );
}
