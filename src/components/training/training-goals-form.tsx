"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { saveTrainingGoals, type GoalActionState } from "@/app/app/train/goals-actions";
import { Icon } from "@/components/ui/icons";
import { trainingGoals, type TrainingGoalId } from "@/lib/training-goals";

const initialState: GoalActionState = { error: "", saved: false };

export default function TrainingGoalsForm({ selected }: { selected: TrainingGoalId[] }) {
  const [chosen, setChosen] = useState(selected);
  const [state, action, pending] = useActionState(saveTrainingGoals, initialState);
  const router = useRouter();
  useEffect(() => { if (state.saved) router.refresh(); }, [state.saved, router]);
  function toggle(id: TrainingGoalId) {
    setChosen((current) => current.includes(id) ? current.filter((goal) => goal !== id) : current.length < 3 ? [...current, id] : current);
  }

  return (
    <form action={action} className="ui-stack">
      <fieldset className="ui-chips ui-stack">
        <legend className="ui-sr-only">Training goals</legend>
        {trainingGoals.map((goal) => {
          const active = chosen.includes(goal.id);
          return (
            <label className="ui-goal" key={goal.id}>
              <input type="checkbox" name="goals" value={goal.id} checked={active} onChange={() => toggle(goal.id)} disabled={!active && chosen.length >= 3} />
              <span>
                <span>{goal.label}<small>{goal.description}</small></span>
                <i aria-hidden="true" />
              </span>
            </label>
          );
        })}
      </fieldset>
      <p className="ui-sub" aria-live="polite"><strong className="ui-count">{chosen.length}</strong> / 3 chosen · Choose up to three for a focused plan.</p>
      {state.error ? <p className="ui-error" role="alert">{state.error}</p> : null}
      {state.saved ? <p className="ui-banner" role="status">Goals saved.</p> : null}
      <button className="ui-btn ui-btn-primary ui-btn-block" disabled={pending}>{pending ? "Saving…" : "Save goals"} <Icon name="next" size={18} /></button>
    </form>
  );
}
