import Link from "next/link";
import TrainingGoalsForm from "@/components/training/training-goals-form";
import { Icon } from "@/components/ui/icons";
import { ButtonLink, Section } from "@/components/ui/page";
import type { TrainingGoalId } from "@/lib/training-goals";
import type { TrainingPlanResult } from "@/lib/training-plan";

const library = [
  { title: "Relaxation & breathing", detail: "Dry down-regulation and breath awareness", href: "/app/train/new?type=Breathwork" },
  { title: "Cognitive anchoring", detail: "Pre-dive cue development" },
  { title: "Cognitive training", detail: "Performance-focused cognitive skills", href: "/app/coming-soon/cognitive-training" },
  { title: "Visualization & rehearsal", detail: "Dry mental rehearsal" },
  { title: "Focus & attention", detail: "Attention-control practice" },
  { title: "Neurofeedback", detail: "Requires a future device integration", href: "/app/coming-soon/neurofeedback" },
] as const;

// Goals → Baseline (Performance Profile) → Plan, as in the design's Train flow.
export default function TrainingFoundation({ selectedGoals, planResult }: { selectedGoals: TrainingGoalId[]; planResult: TrainingPlanResult }) {
  const profileComplete = planResult.status === "ready";
  const step = profileComplete ? 3 : selectedGoals.length ? 2 : 1;
  return (
    <>
      <ol className="ui-stepper-steps" aria-label="Setup steps">
        {["Goals", "Baseline", "Plan"].map((label, i) => (
          <li key={label} aria-current={step === i + 1 ? "step" : undefined} className={step > i + 1 ? "done" : undefined}><span>{i + 1}</span>{label}</li>
        ))}
      </ol>

      <div className="ui-grid ui-grid-2">
        <Section label="Step 1 · Goals">
          <div className="ui-stack">
            <h2 className="ui-title ui-title-md">What are you training for?</h2>
            <p className="ui-sub">Pick what matters most right now. You can change it at any time.</p>
            <TrainingGoalsForm selected={selectedGoals} />
          </div>
        </Section>

        <div className="ui-stack">
          <Section label="Step 2 · Baseline" aside={<span className="ui-pill">{profileComplete ? "Completed" : "Not completed"}</span>}>
            <div className="ui-card ui-stack">
              {profileComplete ? (
                <>
                  <h3>{planResult.plan.dominantFocus}</h3>
                  <p className="ui-sub">{planResult.plan.explanation}</p>
                  <ButtonLink href="/app/performance-profile" variant="ghost" size="sm">View Performance Profile</ButtonLink>
                </>
              ) : (
                <>
                  <h3>Your starting point</h3>
                  <p className="ui-sub">Complete your Performance Profile to set a real baseline for your training pathway.</p>
                  <ButtonLink href="/app/performance-profile" size="sm" icon="next">Complete Performance Profile</ButtonLink>
                </>
              )}
            </div>
          </Section>

          <Section label="Step 3 · Plan" aside={<span className="ui-pill">{profileComplete ? "Mapped" : "Setup incomplete"}</span>}>
            <div className="ui-card ui-stack">
              {profileComplete ? (
                <>
                  {planResult.plan.items.map((item) => <div key={item.id}><h3>{item.title}</h3><p className="ui-sub">{item.detail}</p></div>)}
                  <p className="ui-info">This mapping follows the assessment reference. Guided programs and neurofeedback are future modules.</p>
                </>
              ) : (
                <p className="ui-sub">Your training focus is mapped after your Performance Profile is complete.</p>
              )}
            </div>
          </Section>
        </div>
      </div>

      <Section label="All training" aside={<span className="ui-pill">Dry &amp; pre-dive</span>}>
        <div className="ui-card ui-card-list">
          {library.map((item) => {
            const body = (
              <>
                <span className="ui-kind"><Icon name="train" size={16} /></span>
                <span>{item.title}<small>{item.detail}</small></span>
                {"href" in item ? <Icon name="chevron" size={18} /> : <span className="ui-pill">Later</span>}
              </>
            );
            return "href" in item
              ? <Link href={item.href} className="ui-row" key={item.title}>{body}</Link>
              : <div className="ui-row" key={item.title}>{body}</div>;
          })}
        </div>
        <p className="ui-note">Training modules are dry or pre-dive experiences. Breath-hold work stays retrospective in Log and under direct supervision.</p>
      </Section>
    </>
  );
}
