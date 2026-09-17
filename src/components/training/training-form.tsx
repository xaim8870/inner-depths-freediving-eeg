"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { TrainingActionState } from "@/app/app/train/actions";
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
  submitLabel: string;
};

function FieldError({ message }: { message?: string }) {
  return message ? <p className="form-error">{message}</p> : null;
}

export default function TrainingForm({ action, initialValues, submitLabel }: TrainingFormProps) {
  const [state, formAction, pending] = useActionState(action, initialActionState);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="training-form" noValidate>
      <section className="training-form-card" aria-labelledby="training-session-heading">
        <h2 id="training-session-heading">Session</h2>

        <div className="training-field-grid">
          <label className="training-field">
            <span>Session date</span>
            <input
              type="date"
              name="sessionDate"
              max={today}
              defaultValue={initialValues?.sessionDate ?? today}
              aria-invalid={Boolean(state.fieldErrors.sessionDate)}
              required
            />
            <FieldError message={state.fieldErrors.sessionDate} />
          </label>

          <label className="training-field">
            <span>Session type</span>
            <select
              name="sessionType"
              defaultValue={initialValues?.sessionType ?? ""}
              aria-invalid={Boolean(state.fieldErrors.sessionType)}
              required
            >
              <option value="" disabled>Choose a type</option>
              {trainingSessionTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
            <FieldError message={state.fieldErrors.sessionType} />
          </label>
        </div>
      </section>

      <section className="training-form-card" aria-labelledby="training-effort-heading">
        <h2 id="training-effort-heading">Training load</h2>
        <div className="training-field-grid">
          <label className="training-field">
            <span>Duration <small>Minutes</small></span>
            <input
              type="number"
              name="durationMinutes"
              min="1"
              max="720"
              step="1"
              inputMode="numeric"
              defaultValue={initialValues?.durationMinutes ?? ""}
              aria-invalid={Boolean(state.fieldErrors.durationMinutes)}
              required
            />
            <FieldError message={state.fieldErrors.durationMinutes} />
          </label>

          <label className="training-field">
            <span>Difficulty <small>1 easy · 5 hard</small></span>
            <select
              name="difficulty"
              defaultValue={initialValues?.difficulty ?? ""}
              aria-invalid={Boolean(state.fieldErrors.difficulty)}
              required
            >
              <option value="" disabled>Choose 1–5</option>
              {Array.from({ length: 5 }, (_, index) => index + 1).map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
            <FieldError message={state.fieldErrors.difficulty} />
          </label>
        </div>
      </section>

      <section className="training-form-card" aria-labelledby="training-notes-heading">
        <h2 id="training-notes-heading">Notes</h2>
        <label className="training-field">
          <span>Session notes <small>Optional</small></span>
          <textarea
            name="notes"
            maxLength={2000}
            rows={6}
            placeholder="How the session felt, what you noticed, or context worth remembering."
            defaultValue={initialValues?.notes ?? ""}
            aria-invalid={Boolean(state.fieldErrors.notes)}
          />
          <FieldError message={state.fieldErrors.notes} />
        </label>
      </section>

      {state.error ? <p className="form-error training-form-error" role="alert">{state.error}</p> : null}

      <div className="training-form-actions">
        <Link href="/app/train" className="training-button training-button-secondary">Cancel</Link>
        <button className="training-button training-button-primary" type="submit" disabled={pending}>
          {pending ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
