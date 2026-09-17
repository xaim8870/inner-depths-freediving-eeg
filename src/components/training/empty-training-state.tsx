import Link from "next/link";

export default function EmptyTrainingState() {
  return (
    <div className="empty-training-state">
      <div className="empty-training-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 12h4l2-6 4 12 2-6h4" />
        </svg>
      </div>
      <h2>Your training journal starts here</h2>
      <p>Record a completed session to keep your training history together.</p>
      <Link href="/app/train/new" className="training-button training-button-primary">
        Add your first session
      </Link>
    </div>
  );
}
