import Link from "next/link";
import TrainingFoundation from "@/components/training/training-foundation";
import TrainingList from "@/components/training/training-list";
import { Icon } from "@/components/ui/icons";
import { ButtonLink, PageHead, SafetyNote, Section } from "@/components/ui/page";
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
  // once setup is done, logging training becomes the screen's main action; before that it's a quiet link
  const setupDone = plan.status === "ready";
  const logLink = <Link href="/app/train/new" className="ui-link"><Icon name="plus" size={16} /> Log a training session</Link>;

  return (
    <div className="ui-page">
      <PageHead eyebrow="Goals → Baseline → Plan" title="Train" sub="Set your direction, establish a truthful baseline, and keep your completed training history." />
      <TrainingFoundation selectedGoals={selectedGoals} planResult={plan} />

      {setupDone ? <ButtonLink href="/app/train/new" icon="plus" block>Log a training session</ButtonLink> : null}

      {sessions.length ? (
        <Section label="Completed training" aside={setupDone ? <span className="ui-pill">{sessions.length} logged</span> : logLink}>
          <TrainingList sessions={sessions} />
        </Section>
      ) : !setupDone ? (
        <p className="ui-secondary-links"><span>Already trained today?</span>{logLink}</p>
      ) : null}

      <SafetyNote>Training is dry or pre-dive only. Breath-hold work is logged afterwards in Log, under direct supervision.</SafetyNote>
    </div>
  );
}
