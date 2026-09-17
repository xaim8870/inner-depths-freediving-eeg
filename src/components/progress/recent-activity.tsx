import Link from "next/link";
import type { ProgressActivity } from "@/db/progress";
import { disciplineLabels } from "@/lib/profile-options";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function formatDiveDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${(seconds % 60).toString().padStart(2, "0")}`;
}

export default function RecentActivity({ activity }: { activity: ProgressActivity[] }) {
  return (
    <section className="progress-section" aria-labelledby="recent-activity-heading">
      <div className="progress-section-heading">
        <div>
          <span>Journal</span>
          <h2 id="recent-activity-heading">Recent activity</h2>
        </div>
      </div>
      <div className="progress-activity-list">
        {activity.map((item) => {
          const isDive = item.kind === "dive";
          const title = isDive ? disciplineLabels[item.discipline] : item.sessionType;
          const detail = isDive
            ? `${item.depthMeters.toFixed(1)} m · ${formatDiveDuration(item.durationSeconds)}`
            : `${item.durationMinutes} min · Difficulty ${item.difficulty ?? "–"}/5`;
          return (
            <Link
              href={isDive ? `/app/log/${item.id}` : `/app/train/${item.id}`}
              className="progress-activity-item"
              key={`${item.kind}-${item.id}`}
            >
              <div className={`progress-activity-icon ${item.kind}`} aria-hidden="true">
                {isDive ? "D" : "T"}
              </div>
              <div className="progress-activity-info">
                <strong>{title}</strong>
                <span>{formatDate(item.date)} · {detail}</span>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="m9 6 6 6-6 6" />
              </svg>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
