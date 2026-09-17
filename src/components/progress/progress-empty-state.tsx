import Link from "next/link";

export default function ProgressEmptyState() {
  return (
    <div className="progress-empty-state">
      <div className="progress-empty-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 19V5M4 19h16" />
          <path d="m7 15 4-5 3 3 5-7" />
        </svg>
      </div>
      <h2>Your progress starts with a log</h2>
      <p>Add completed dives or training sessions to build a truthful view of your activity over time.</p>
      <div className="progress-empty-actions">
        <Link href="/app/log/new">Log a dive</Link>
        <Link href="/app/train/new">Log training</Link>
      </div>
    </div>
  );
}
