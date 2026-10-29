import Link from "next/link";
import TrainingGoalsForm from "@/components/training/training-goals-form";
import { More } from "@/components/ui/disclosure";
import { ButtonLink, Section } from "@/components/ui/page";
import { trainingGoals, type TrainingGoalId } from "@/lib/training-goals";
import type { TrainingPlanResult } from "@/lib/training-plan";

// Goals → Baseline (Performance Profile) → Plan. Only the current step carries the main button;
// finished steps collapse to a summary, and steps that aren't reachable yet aren't shown.
export default function TrainingFoundation({ selectedGoals, planResult }: { selectedGoals: TrainingGoalId[]; planResult: TrainingPlanResult }) {
  const profileComplete = planResult.status === "ready";
  const step = profileComplete ? 3 : selectedGoals.length ? 2 : 1;
  const goalLabels = selectedGoals.map((id) => trainingGoals.find((g) => g.id === id)?.label).filter(Boolean) as string[];

  return (
    <>
      <ol className="ui-stepper-steps" aria-label="Setup steps">
        {["Goals", "Baseline", "Plan"].map((label, i) => (
          <li key={label} aria-current={step === i + 1 ? "step" : undefined} className={step > i + 1 ? "done" : undefined}><span>{i + 1}</span>{label}</li>
        ))}
      </ol>

      {step === 1 ? (
        <Section label="Step 1 · Goals">
          <div className="ui-stack">
            <h2 className="ui-title ui-title-md">What are you training for?</h2>
            <p className="ui-sub">Pick up to three. You can change them at any time.</p>
            <TrainingGoalsForm selected={selectedGoals} />
          </div>
        </Section>
      ) : (
        <Section label="Your goals">
          <div className="ui-card ui-stack">
            <div className="ui-tags">{goalLabels.map((g) => <span className="ui-tag" key={g}>{g}</span>)}</div>
            <More summary="Change goals" plain>
              <TrainingGoalsForm selected={selectedGoals} secondary />
            </More>
          </div>
        </Section>
      )}

      {step === 2 ? (
        <Section label="Step 2 · Baseline">
          <div className="ui-card ui-stack">
            <h3>Your starting point</h3>
            <p className="ui-sub">A 10-minute Performance Profile sets a real baseline and maps your training focus.</p>
            <ButtonLink href="/app/performance-profile" icon="next">Complete Performance Profile</ButtonLink>
          </div>
        </Section>
      ) : null}

      {step === 3 && planResult.status === "ready" ? (
        <Section label="Your plan" aside={<Link href="/app/performance-profile" className="ui-link">View profile</Link>}>
          <div className="ui-card ui-stack">
            <span className="ui-eyebrow">Focus · {planResult.plan.dominantFocus}</span>
            {planResult.plan.items.map((item) => <div key={item.id}><h3>{item.title}</h3><p className="ui-sub">{item.detail}</p></div>)}
            <p className="ui-info">This mapping follows the assessment reference. Guided programs and neurofeedback are future modules.</p>
          </div>
        </Section>
      ) : null}
    </>
  );
}
