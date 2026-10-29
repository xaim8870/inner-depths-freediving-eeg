import TrainingFoundation from "@/components/training/training-foundation";
import TrainingList from "@/components/training/training-list";
import { ButtonLink, Empty, PageHead, SafetyNote, Section } from "@/components/ui/page";
import { getTrainingGoalsForUser } from "@/db/training-goals";
import { getTrainingSessionsForUser } from "@/db/training-sessions";
import { requireCurrentUser } from "@/lib/auth-session";
import type { TrainingGoalId } from "@/lib/training-goals";
import { performanceProfilePlanProvider } from "@/lib/training-plan-server";

export default async function TrainPage() {
  const user = await requireCurrentUser();
  const [sessions, goals] = await Promise.all([getTrainingSessionsForUser(user.id), getTrainingGoalsForUser(user.id)]);
  const selectedGoals = goals.map((goal) => goal.goal as TrainingGoalId);
  const plan = await performanceProfilePlanProvider.getPlan({ userId: user.id, goals: selectedGoals });

  return (
    <div className="ui-page ui-page-wide">
      <PageHead eyebrow="Goals → Baseline → Plan" title="Train" sub="Set your direction, establish a truthful baseline, and keep your completed training history."
        actions={<ButtonLink href="/app/train/new" icon="plus">Add session</ButtonLink>} />
      <TrainingFoundation selectedGoals={selectedGoals} planResult={plan} />
      {sessions.length ? (
        <Section label="Completed training" aside={<span className="ui-pill">{sessions.length} logged</span>}>
          <TrainingList sessions={sessions} />
        </Section>
      ) : (
        <Empty title="Your training journal starts here" action={<ButtonLink href="/app/train/new" icon="plus">Add your first session</ButtonLink>}>
          Record a completed session to keep your training history together.
        </Empty>
      )}
      <SafetyNote />
    </div>
  );
}
