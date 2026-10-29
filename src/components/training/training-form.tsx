"use client";

import { useActionState } from "react";
import type { TrainingActionState } from "@/app/app/train/actions";
import { FormActions, More } from "@/components/ui/disclosure";
import { ChoiceGroup, RatingScale, TextArea, TextField } from "@/components/ui/form";
import { Icon } from "@/components/ui/icons";
import { keepValuesOnSubmit } from "@/components/ui/keep-values-on-submit";
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
    <form action={formAction} onSubmit={keepValuesOnSubmit(formAction)} className="ui-stack" noValidate>
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
      <div className="ui-card">
        <More summary="Add notes" hint="optional" open={Boolean(initialValues?.notes || errors.notes)} plain>
          <TextArea label="Session notes" optional name="notes" maxLength={2000} rows={5} placeholder="How the session felt, what you noticed, or context worth remembering." defaultValue={initialValues?.notes ?? ""} error={errors.notes} />
        </More>
      </div>
      <FormActions cancelHref="/app/train">
        <button className="ui-btn ui-btn-primary" type="submit" disabled={pending}><Icon name="check" size={18} /> {pending ? "Saving…" : submitLabel}</button>
      </FormActions>
    </form>
  );
}
