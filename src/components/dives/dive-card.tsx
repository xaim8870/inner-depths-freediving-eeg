import Link from "next/link";
import type { Dive } from "@/db/dives";
import { disciplineLabels } from "@/lib/profile-options";

function formatDiveDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function formatDiveDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
}

export default function DiveCard({ dive }: { dive: Dive }) {
  return (
    <Link href={`/app/log/${dive.id}`} className="dive-card">
      <div className="dive-comfort" aria-label={`Comfort ${dive.comfort ?? "not rated"} out of 5`}>
        {dive.comfort ?? "–"}
        <small>/5</small>
      </div>
      <div className="dive-card-info">
        <div className="dive-card-title">
          <strong>{disciplineLabels[dive.discipline]}</strong>
          <span>{dive.depthMeters.toFixed(1)} m</span>
        </div>
        <div className="dive-card-meta">
          <span>{formatDiveDate(dive.diveDate)}</span>
          <span>{formatDiveDuration(dive.durationSeconds)}</span>
          {dive.location ? <span>{dive.location}</span> : null}
        </div>
      </div>
      <svg className="dive-card-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="m9 6 6 6-6 6" />
      </svg>
    </Link>
  );
}
