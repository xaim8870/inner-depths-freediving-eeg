import Link from "next/link";
import EmptyTrainingState from "@/components/training/empty-training-state";
import TrainingList from "@/components/training/training-list";
import { getTrainingSessionsForUser } from "@/db/training-sessions";
import { requireCurrentUser } from "@/lib/auth-session";

export default async function TrainPage() {
  const user = await requireCurrentUser();
  const sessions = await getTrainingSessionsForUser(user.id);

  return (
    <section className="training-page">
      <header className="training-page-header">
        <div>
          <div className="training-eyebrow">Training journal</div>
          <h1>Train</h1>
          <p>Sessions you completed, recorded in one place.</p>
        </div>
        <Link href="/app/train/new" className="training-add-button">
          <span aria-hidden="true">+</span> Add session
        </Link>
      </header>

      <div className="training-scope-note">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
        <span>This journal records completed sessions. It does not prescribe breath-hold training.</span>
      </div>

      {sessions.length > 0 ? (
        <div className="training-history-section">
          <h2>Training history</h2>
          <TrainingList sessions={sessions} />
        </div>
      ) : <EmptyTrainingState />}
    </section>
  );
}
