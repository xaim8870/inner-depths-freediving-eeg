import Link from "next/link";
import DiveList from "@/components/dives/dive-list";
import EmptyDiveState from "@/components/dives/empty-dive-state";
import { getDivesForUser } from "@/db/dives";
import { requireCurrentUser } from "@/lib/auth-session";

export default async function LogPage() {
  const user = await requireCurrentUser();
  const dives = await getDivesForUser(user.id);

  return (
    <section className="dive-log-page">
      <header className="dive-page-header">
        <div>
          <div className="dive-eyebrow">Dive journal</div>
          <h1>Log</h1>
          <p>Your completed dives, reflections, and progress.</p>
        </div>
        <Link href="/app/log/new" className="dive-add-button">
          <span aria-hidden="true">+</span> Add dive
        </Link>
      </header>

      <div className="dive-safety-note">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
        <span>A record of dives completed with your buddy and safety in place.</span>
      </div>

      {dives.length > 0 ? (
        <div className="dive-history-section">
          <h2>Dive history</h2>
          <DiveList dives={dives} />
        </div>
      ) : <EmptyDiveState />}
    </section>
  );
}
