import Link from "next/link";
import DiveRow from "@/components/dives/dive-row";
import { Icon } from "@/components/ui/icons";
import type { CompletedSession } from "@/db/completed-sessions";
import type { Dive } from "@/db/dives";
import { completedSessionLabels, type CompletedSessionCategory } from "@/lib/completed-session-options";
import { formatDate, formatDuration } from "@/lib/format";

type Item = { kind: "dive"; value: Dive } | { kind: "session"; value: CompletedSession };

function sessionSummary(session: CompletedSession) {
  const category = session.sessionCategory as CompletedSessionCategory;
  if (category === "pool") return `${session.poolDiscipline} · ${session.distanceMeters} m`;
  if (category === "dry_hold") return `Best ${formatDuration(session.bestHoldSeconds ?? 0)} · ${session.holdCount} holds`;
  return `${session.tableType} table · ${session.completedRounds}/${session.tableRounds} rounds`;
}

export default function SessionHistory({ dives, sessions, filter }: { dives: Dive[]; sessions: CompletedSession[]; filter: string }) {
  const items: Item[] = [
    ...(filter === "all" || filter === "dive" ? dives.map((value) => ({ kind: "dive" as const, value })) : []),
    ...sessions.filter((value) => filter === "all" || value.sessionCategory === filter).map((value) => ({ kind: "session" as const, value })),
  ].sort((a, b) => {
    const av = a.kind === "dive" ? a.value.diveDate : a.value.sessionDate;
    const bv = b.kind === "dive" ? b.value.diveDate : b.value.sessionDate;
    return bv.localeCompare(av) || b.value.createdAt.getTime() - a.value.createdAt.getTime();
  });

  if (!items.length) return <p className="ui-sub">Nothing logged of this type yet.</p>;
  return (
    <div className="ui-card ui-card-list">
      {items.map((item) => {
        if (item.kind === "dive") return <DiveRow key={`d-${item.value.id}`} dive={item.value} />;
        const session = item.value;
        return (
          <Link className="ui-row" href={`/app/log/sessions/${session.id}`} key={`s-${session.id}`}>
            <span className="ui-kind">{completedSessionLabels[session.sessionCategory as CompletedSessionCategory]}</span>
            <span>
              {formatDate(session.sessionDate)}
              <small>{sessionSummary(session)} · {session.durationMinutes} min{session.overallFeel ? ` · feel ${session.overallFeel}/5` : ""}</small>
            </span>
            <Icon name="chevron" size={18} />
          </Link>
        );
      })}
    </div>
  );
}
