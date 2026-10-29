import Link from "next/link";
import { Icon } from "@/components/ui/icons";
import type { TrainingSession } from "@/db/training-sessions";
import { formatDate } from "@/lib/format";

export default function TrainingList({ sessions }: { sessions: TrainingSession[] }) {
  return (
    <div className="ui-card ui-card-list">
      {sessions.map((session) => (
        <Link key={session.id} href={`/app/train/${session.id}`} className="ui-row">
          <span className="ui-score" aria-label={`${session.durationMinutes} minutes`}>{session.durationMinutes}<small className="ui-score-unit">m</small></span>
          <span>
            {session.sessionType}
            <small>{formatDate(session.sessionDate, true)} · difficulty {session.difficulty ?? "–"}/5</small>
          </span>
          <Icon name="chevron" size={18} />
        </Link>
      ))}
    </div>
  );
}
