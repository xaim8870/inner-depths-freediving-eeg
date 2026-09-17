import Link from "next/link";
import SectionHeading from "@/components/home/section-heading";
import type { TrainingSession } from "@/db/training-sessions";

function formatSessionDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export default function TrainingSummary({
  sessionsLast30Days,
  latestSession,
}: {
  sessionsLast30Days: number;
  latestSession: TrainingSession | null;
}) {
  if (!latestSession) return null;

  return (
    <section aria-label="Training activity" className="home-training-summary">
      <SectionHeading
        accessory={<Link href="/app/train" className="home-view-log">View training</Link>}
      >
        Training activity
      </SectionHeading>
      <Link href={`/app/train/${latestSession.id}`} className="home-training-card">
        <div className="home-training-count">
          <strong>{sessionsLast30Days}</strong>
          <span>Last 30 days</span>
        </div>
        <div className="home-training-latest">
          <span>Latest session</span>
          <strong>{latestSession.sessionType}</strong>
          <small>
            {formatSessionDate(latestSession.sessionDate)} · {latestSession.durationMinutes} min
          </small>
        </div>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="m9 6 6 6-6 6" />
        </svg>
      </Link>
    </section>
  );
}
