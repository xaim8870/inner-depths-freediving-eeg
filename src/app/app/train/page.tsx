import Link from "next/link";
import EmptyTrainingState from "@/components/training/empty-training-state";
import TrainingList from "@/components/training/training-list";
import TrainingFoundation from "@/components/training/training-foundation";
import { getTrainingSessionsForUser } from "@/db/training-sessions";
import { getTrainingGoalsForUser } from "@/db/training-goals";
import { requireCurrentUser } from "@/lib/auth-session";
import { performanceProfilePlanProvider } from "@/lib/training-plan-server";

export default async function TrainPage() {
  const user = await requireCurrentUser();
  const [sessions, goals] = await Promise.all([
    getTrainingSessionsForUser(user.id),
    getTrainingGoalsForUser(user.id),
  ]);
  const selectedGoals = goals.map((goal) => goal.goal as import("@/lib/training-goals").TrainingGoalId);
  const plan = await performanceProfilePlanProvider.getPlan({ userId: user.id, goals: selectedGoals });

  return (
    <section className="training-page">
      <header className="training-page-header">
        <div>
          <div className="training-eyebrow">Goals → Baseline → Plan</div>
          <h1>Training</h1>
          <p>Set your direction, establish a truthful baseline, and keep your completed training history.</p>
        </div>
        <Link href="/app/train/new" className="training-add-button">
          <span aria-hidden="true">+</span> Add session
        </Link>
      </header>

      <TrainingFoundation selectedGoals={selectedGoals} planResult={plan} />

      {sessions.length > 0 ? (
        <div className="training-history-section">
          <div className="section-title-row"><h2>Completed training</h2><span>Manual log</span></div>
          <TrainingList sessions={sessions} />
        </div>
      ) : <EmptyTrainingState />}
    </section>
  );
}
