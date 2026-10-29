"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { TrainingActionState } from "@/app/app/train/actions";
import { ChoiceGroup, RatingScale, TextArea, TextField } from "@/components/ui/form";
import { Icon } from "@/components/ui/icons";
import { trainingSessionTypes } from "@/lib/training-options";

const initialActionState: TrainingActionState = { error: "", fieldErrors: {} };

export type TrainingFormValues = {
  sessionDate: string;
  sessionType: string;
  durationMinutes: number;
  difficulty: number | null;
  notes: string | null;
};

type TrainingFormProps = {
  action: (state: TrainingActionState, formData: FormData) => Promise<TrainingActionState>;
  initialValues?: TrainingFormValues;
  defaultType?: string;
  submitLabel: string;
};

export default function TrainingForm({ action, initialValues, defaultType, submitLabel }: TrainingFormProps) {
  const [state, formAction, pending] = useActionState(action, initialActionState);
  const errors = state.fieldErrors;
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="ui-stack" noValidate>
      {state.error ? <p className="ui-banner ui-banner-error" role="alert">{state.error}</p> : null}
      <section className="ui-section">
        <h2 className="ui-label">Session</h2>
        <div className="ui-card ui-stack">
          <div className="ui-fields-2">
            <TextField label="Date" type="date" name="sessionDate" max={today} defaultValue={initialValues?.sessionDate ?? today} required error={errors.sessionDate} />
            <TextField label="Duration (minutes)" type="number" name="durationMinutes" min={1} max={720} step={1} inputMode="numeric" defaultValue={initialValues?.durationMinutes ?? ""} required error={errors.durationMinutes} />
          </div>
          <ChoiceGroup legend="Session type" name="sessionType" options={trainingSessionTypes} value={initialValues?.sessionType ?? defaultType} required error={errors.sessionType} />
          <RatingScale legend="Difficulty" name="difficulty" value={initialValues?.difficulty} low="Easy" high="Hard" required error={errors.difficulty} />
        </div>
      </section>
      <section className="ui-section">
        <h2 className="ui-label">Notes</h2>
        <div className="ui-card">
          <TextArea label="Session notes" optional name="notes" maxLength={2000} rows={5} placeholder="How the session felt, what you noticed, or context worth remembering." defaultValue={initialValues?.notes ?? ""} error={errors.notes} />
        </div>
      </section>
      <div className="ui-actions">
        <Link href="/app/train" className="ui-btn ui-btn-ghost">Cancel</Link>
        <button className="ui-btn ui-btn-primary" type="submit" disabled={pending}><Icon name="check" size={18} /> {pending ? "Saving…" : submitLabel}</button>
      </div>
    </form>
  );
}
