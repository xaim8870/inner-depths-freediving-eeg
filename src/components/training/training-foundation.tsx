import Link from "next/link";
import TrainingGoalsForm from "@/components/training/training-goals-form";
import type { TrainingGoalId } from "@/lib/training-goals";
import type { TrainingPlanResult } from "@/lib/training-plan";

const library = [
  { title: "Relaxation & breathing", detail: "Dry down-regulation and breath awareness", status: "Log session", href: "/app/train/new?type=Breathwork" },
  { title: "Cognitive anchoring", detail: "Pre-dive cue development", status: "Coming later" },
  { title: "Cognitive training", detail: "Performance-focused cognitive skills", status: "Coming later" },
  { title: "Visualization & rehearsal", detail: "Dry mental rehearsal", status: "Coming later" },
  { title: "Focus & attention", detail: "Attention-control practice", status: "Coming later" },
  { title: "Neurofeedback", detail: "Requires a future device integration", status: "Device phase" },
] as const;

export default function TrainingFoundation({ selectedGoals, planResult }: { selectedGoals: TrainingGoalId[]; planResult: TrainingPlanResult }) {
  const profileComplete = planResult.status === "ready";
  return <div className="training-foundation">
    <div className="training-stepper" aria-label="Training setup progress"><span className="active">1 <b>Goals</b></span><i /><span>2 <b>Baseline</b></span><i /><span>3 <b>Plan</b></span></div>
    <TrainingGoalsForm selected={selectedGoals} />
    {selectedGoals.length || profileComplete ? <>
    <section className="baseline-panel">
      <div className="train-section-heading"><div><span>Step 2</span><h2>Your starting point</h2></div><small>{profileComplete ? "Completed" : "Not completed"}</small></div>
      {profileComplete ? <><strong className="training-profile-focus">{planResult.plan.dominantFocus}</strong><p>{planResult.plan.explanation}</p><Link href="/app/performance-profile" className="training-button training-button-secondary">View Performance Profile</Link></> : <><p>Complete your Performance Profile to establish a real baseline for the reference training pathways.</p><Link href="/app/performance-profile" className="training-button training-button-secondary">Complete Performance Profile</Link></>}
    </section>
    <section className="weekly-plan-panel">
      <div className="train-section-heading"><div><span>Step 3</span><h2>Profile focus</h2></div><small>{profileComplete ? "Profile mapped" : "Setup incomplete"}</small></div>
      {profileComplete ? <>{planResult.plan.items.map((item) => <div className="training-plan-item" key={item.id}><strong>{item.title}</strong><p>{item.detail}</p></div>)}<p className="training-scope-note compact">This mapping follows the assessment reference. Guided programs and neurofeedback remain future modules.</p></> : <p>Your training direction will be mapped after your Performance Profile is completed. No focus has been invented.</p>}
    </section>
    </> : null}
    <section className="training-library"><div className="section-title-row"><h2>All Training</h2><span>Dry &amp; pre-dive</span></div>
      <div className="training-library-list">{library.map((item) => {
        const content = <><span className="library-icon" aria-hidden="true">◎</span><span><strong>{item.title}</strong><small>{item.detail}</small></span><b>{item.status}</b></>;
        return "href" in item ? <Link href={item.href} className="training-library-card" key={item.title}>{content}</Link> : <div className="training-library-card future" key={item.title}>{content}</div>;
      })}</div>
      <p className="training-scope-note compact">Training modules are dry or pre-dive experiences. Breath-hold work remains retrospective in Log and under direct supervision.</p>
    </section>
  </div>;
}
