"use client";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { saveTrainingGoals, type GoalActionState } from "@/app/app/train/goals-actions";
import { trainingGoals, type TrainingGoalId } from "@/lib/training-goals";

const initialState: GoalActionState = { error: "", saved: false };
export default function TrainingGoalsForm({ selected }: { selected: TrainingGoalId[] }) {
  const [chosen, setChosen] = useState(selected);
  const [state, action, pending] = useActionState(saveTrainingGoals, initialState);
  const router = useRouter();
  useEffect(() => { if (state.saved) router.refresh(); }, [state.saved, router]);
  function toggle(id: TrainingGoalId) { setChosen((current) => current.includes(id) ? current.filter((goal) => goal !== id) : current.length < 3 ? [...current, id] : current); }
  return <form action={action} className="goals-panel">
    <div className="train-section-heading"><div><span>Step 1</span><h2>What are you training for?</h2></div><small>{chosen.length}/3 selected</small></div>
    <p>Choose up to three current goals. You can change them at any time.</p>
    <div className="goals-grid">{trainingGoals.map((goal) => {
      const active = chosen.includes(goal.id);
      return <label className={`goal-option ${active ? "selected" : ""}`} key={goal.id}>
        <input type="checkbox" name="goals" value={goal.id} checked={active} onChange={() => toggle(goal.id)} disabled={!active && chosen.length >= 3} />
        <span><strong>{goal.label}</strong><small>{goal.description}</small></span><b aria-hidden="true">{active ? "✓" : "+"}</b>
      </label>;
    })}</div>
    {state.error ? <p className="form-error" role="alert">{state.error}</p> : null}
    {state.saved ? <p className="save-success" role="status">Goals saved.</p> : null}
    <button className="training-button training-button-primary" disabled={pending}>{pending ? "Saving…" : "Save goals"}</button>
  </form>;
}
