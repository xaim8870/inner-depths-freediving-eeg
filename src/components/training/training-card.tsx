import Link from "next/link";
import type { TrainingSession } from "@/db/training-sessions";

function formatSessionDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export default function TrainingCard({ session }: { session: TrainingSession }) {
  return (
    <Link href={`/app/train/${session.id}`} className="training-card">
      <div className="training-duration" aria-label={`${session.durationMinutes} minutes`}>
        {session.durationMinutes}
        <small>min</small>
      </div>
      <div className="training-card-info">
        <div className="training-card-title">
          <strong>{session.sessionType}</strong>
          <span>Difficulty {session.difficulty ?? "–"}/5</span>
        </div>
        <div className="training-card-meta">{formatSessionDate(session.sessionDate)}</div>
      </div>
      <svg className="training-card-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="m9 6 6 6-6 6" />
      </svg>
    </Link>
  );
}
