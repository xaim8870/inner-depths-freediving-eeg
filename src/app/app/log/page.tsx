import Link from "next/link";
import SessionHistory from "@/components/log/session-history";
import { Icon, type IconName } from "@/components/ui/icons";
import { ButtonLink, Empty, PageHead, SafetyNote, Section } from "@/components/ui/page";
import { getCompletedSessionsForUser } from "@/db/completed-sessions";
import { getDivesForUser } from "@/db/dives";
import { requireCurrentUser } from "@/lib/auth-session";

const types: Array<{ id: string; label: string; detail: string; href: string; icon: IconName }> = [
  { id: "dive", label: "Dive", detail: "Open-water depth dive", href: "/app/log/new", icon: "drop" },
  { id: "pool", label: "Pool", detail: "Dynamic or static in the pool", href: "/app/log/sessions/new?type=pool", icon: "wave" },
  { id: "dry_hold", label: "Dry hold", detail: "Breath-hold on land", href: "/app/log/sessions/new?type=dry_hold", icon: "lungs" },
  { id: "table", label: "Table", detail: "CO₂ / O₂ table session", href: "/app/log/sessions/new?type=table", icon: "table" },
];

export default async function LogPage({ searchParams }: { searchParams: Promise<{ type?: string; saved?: string }> }) {
  const user = await requireCurrentUser();
  const [dives, sessions, params] = await Promise.all([getDivesForUser(user.id), getCompletedSessionsForUser(user.id), searchParams]);
  const filter = ["all", ...types.map((type) => type.id)].includes(params.type ?? "all") ? params.type ?? "all" : "all";
  const total = dives.length + sessions.length;

  return (
    <div className="ui-page ui-page-wide">
      <PageHead eyebrow="New entry" title="Log a session" sub="What did you do? Pick a type to begin. This log records what already happened — it never prescribes a session." />
      {params.saved ? <p className="ui-banner" role="status">{params.saved === "dive" ? "Dive" : "Session"} saved to your log.</p> : null}

      <div className="ui-grid ui-grid-main">
        <div className="ui-stack">
          <nav className="ui-types" aria-label="Add a completed session">
            {types.map((type) => (
              <Link key={type.id} href={type.href} className="ui-type">
                <span><Icon name={type.icon} /></span>
                <span><strong>{type.label}</strong><small>{type.detail}</small></span>
              </Link>
            ))}
          </nav>
          <SafetyNote>Dives are records of dives you completed with a buddy and safety in place. Pool, dry-hold and table records require supervision.</SafetyNote>
        </div>
        <aside className="ui-card ui-stack">
          <h2 className="ui-label">4 quick steps · about 2 min</h2>
          <ol className="ui-steps-list">
            {["Session", "Conditions & gear", "Body & feel", "Prep & notes"].map((step, i) => <li key={step}><span>{i + 1}</span>{step}</li>)}
          </ol>
          <ButtonLink href="/app/log/new" icon="next" block>Start logging a dive</ButtonLink>
        </aside>
      </div>

      {total ? (
        <Section label="History" aside={<span className="ui-pill">{total} logged</span>}>
          <nav className="ui-tags" aria-label="Filter history">
            {[{ id: "all", label: "All" }, ...types].map((type) => (
              <Link key={type.id} href={type.id === "all" ? "/app/log" : `/app/log?type=${type.id}`} className="ui-choice" aria-current={filter === type.id ? "true" : undefined}>
                <span className={filter === type.id ? "ui-choice-on" : undefined}>{type.label}</span>
              </Link>
            ))}
          </nav>
          <SessionHistory dives={dives} sessions={sessions} filter={filter} />
        </Section>
      ) : (
        <Empty title="Your log starts here" action={<ButtonLink href="/app/log/new" icon="plus">Log your first dive</ButtonLink>}>
          Add a dive or a completed training session. Your history and patterns build from real records.
        </Empty>
      )}
    </div>
  );
}
