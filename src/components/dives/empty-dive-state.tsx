import Link from "next/link";

export default function EmptyDiveState() {
  return (
    <div className="empty-dive-state">
      <div className="empty-dive-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 3c3.5 4 6 7 6 10a6 6 0 0 1-12 0c0-3 2.5-6 6-10Z" />
          <path d="M9 14h6M12 11v6" />
        </svg>
      </div>
      <h2>Your dive journal starts here</h2>
      <p>Record a completed dive to build your history and reflect on comfort over time.</p>
      <Link href="/app/log/new" className="dive-button dive-button-primary">Add your first dive</Link>
    </div>
  );
}
