import Link from "next/link";
import type { Dive } from "@/db/dives";
import type { CompletedSession } from "@/db/completed-sessions";
import { disciplineLabels } from "@/lib/profile-options";
import { completedSessionLabels, type CompletedSessionCategory } from "@/lib/completed-session-options";

type Item = { kind: "dive"; value: Dive } | { kind: "session"; value: CompletedSession };

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}
function formatSeconds(value: number) { const minutes = Math.floor(value / 60); return `${minutes}:${String(value % 60).padStart(2, "0")}`; }

export default function SessionHistory({ dives, sessions, filter }: { dives: Dive[]; sessions: CompletedSession[]; filter: string }) {
  const items: Item[] = [
    ...(filter === "all" || filter === "dive" ? dives.map((value) => ({ kind: "dive" as const, value })) : []),
    ...sessions.filter((value) => filter === "all" || value.sessionCategory === filter).map((value) => ({ kind: "session" as const, value })),
  ].sort((a, b) => {
    const av = a.kind === "dive" ? a.value.diveDate : a.value.sessionDate;
    const bv = b.kind === "dive" ? b.value.diveDate : b.value.sessionDate;
    return bv.localeCompare(av) || b.value.createdAt.getTime() - a.value.createdAt.getTime();
  });

  if (!items.length) return <div className="session-empty-filter"><h2>No sessions in this view</h2><p>Choose a session type above to add a completed record.</p></div>;
  return <div className="dive-list">{items.map((item) => {
    if (item.kind === "dive") {
      const dive = item.value;
      return <Link className="session-history-card" href={`/app/log/${dive.id}`} key={`d-${dive.id}`}>
        <span className="session-kind">Dive</span><div><strong>{disciplineLabels[dive.discipline]} · {dive.depthMeters.toFixed(1)} m</strong><p>{formatDate(dive.diveDate)}{dive.location ? ` · ${dive.location}` : ""} · {formatSeconds(dive.durationSeconds)}{dive.overallFeel ? ` · Feel ${dive.overallFeel}/5` : ""}</p></div><span aria-hidden="true">›</span>
      </Link>;
    }
    const session = item.value;
    const category = session.sessionCategory as CompletedSessionCategory;
    const summary = category === "pool" ? `${session.poolDiscipline} · ${session.distanceMeters} m` : category === "dry_hold" ? `Best ${formatSeconds(session.bestHoldSeconds ?? 0)} · ${session.holdCount} holds` : `${session.tableType} · ${session.completedRounds}/${session.tableRounds} rounds`;
    return <Link className="session-history-card" href={`/app/log/sessions/${session.id}`} key={`s-${session.id}`}>
      <span className="session-kind">{completedSessionLabels[category]}</span><div><strong>{summary}</strong><p>{formatDate(session.sessionDate)} · {session.durationMinutes} min{session.overallFeel ? ` · Feel ${session.overallFeel}/5` : ""}</p></div><span aria-hidden="true">›</span>
    </Link>;
  })}</div>;
}
