"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { DiveActionState } from "@/app/app/log/actions";
import { disciplineLabels, diveDisciplines } from "@/lib/profile-options";

const initialDiveActionState: DiveActionState = { error: "", fieldErrors: {} };

export type DiveFormValues = {
  diveDate: string;
  discipline: (typeof diveDisciplines)[number];
  depthMeters: number;
  durationSeconds: number;
  location: string | null;
  perceivedEffort: number | null;
  comfort: number | null;
  notes: string | null;
};

type DiveFormProps = {
  action: (state: DiveActionState, formData: FormData) => Promise<DiveActionState>;
  initialValues?: DiveFormValues;
  submitLabel: string;
};

function FieldError({ message }: { message?: string }) {
  return message ? <p className="form-error">{message}</p> : null;
}

export default function DiveForm({ action, initialValues, submitLabel }: DiveFormProps) {
  const [state, formAction, pending] = useActionState(action, initialDiveActionState);
  const minutes = initialValues ? Math.floor(initialValues.durationSeconds / 60) : "";
  const seconds = initialValues ? initialValues.durationSeconds % 60 : "";

  return (
    <form action={formAction} className="dive-form" noValidate>
      <section className="dive-form-card" aria-labelledby="session-heading">
        <h2 id="session-heading">Session</h2>

        <div className="dive-field-grid">
          <label className="dive-field">
            <span>Dive date</span>
            <input
              type="date"
              name="diveDate"
              max={new Date().toISOString().slice(0, 10)}
              defaultValue={initialValues?.diveDate ?? new Date().toISOString().slice(0, 10)}
              aria-invalid={Boolean(state.fieldErrors.diveDate)}
              required
            />
            <FieldError message={state.fieldErrors.diveDate} />
          </label>

          <label className="dive-field">
            <span>Location <small>Optional</small></span>
            <input
              type="text"
              name="location"
              maxLength={200}
              placeholder="Blue Hole, Dahab"
              defaultValue={initialValues?.location ?? ""}
              aria-invalid={Boolean(state.fieldErrors.location)}
            />
            <FieldError message={state.fieldErrors.location} />
          </label>
        </div>

        <fieldset className="dive-fieldset">
          <legend>Discipline</legend>
          <div className="dive-discipline-options">
            {diveDisciplines.map((discipline) => (
              <label key={discipline}>
                <input
                  type="radio"
                  name="discipline"
                  value={discipline}
                  defaultChecked={(initialValues?.discipline ?? "constant_weight") === discipline}
                />
                <span>{disciplineLabels[discipline]}</span>
              </label>
            ))}
          </div>
          <FieldError message={state.fieldErrors.discipline} />
        </fieldset>
      </section>

      <section className="dive-form-card" aria-labelledby="performance-heading">
        <h2 id="performance-heading">Dive</h2>
        <div className="dive-field-grid dive-field-grid-three">
          <label className="dive-field">
            <span>Depth <small>m</small></span>
            <input
              type="number"
              name="depthMeters"
              min="0"
              max="300"
              step="0.1"
              inputMode="decimal"
              defaultValue={initialValues?.depthMeters ?? ""}
              aria-invalid={Boolean(state.fieldErrors.depthMeters)}
              required
            />
            <FieldError message={state.fieldErrors.depthMeters} />
          </label>

          <label className="dive-field">
            <span>Minutes</span>
            <input
              type="number"
              name="durationMinutes"
              min="0"
              max="719"
              step="1"
              inputMode="numeric"
              defaultValue={minutes}
              aria-invalid={Boolean(state.fieldErrors.durationMinutes)}
              required
            />
            <FieldError message={state.fieldErrors.durationMinutes} />
          </label>

          <label className="dive-field">
            <span>Seconds</span>
            <input
              type="number"
              name="durationRemainderSeconds"
              min="0"
              max="59"
              step="1"
              inputMode="numeric"
              defaultValue={seconds}
              aria-invalid={Boolean(state.fieldErrors.durationRemainderSeconds)}
              required
            />
            <FieldError message={state.fieldErrors.durationRemainderSeconds} />
          </label>
        </div>
      </section>

      <section className="dive-form-card" aria-labelledby="reflection-heading">
        <h2 id="reflection-heading">Post-dive reflection</h2>
        <div className="dive-field-grid">
          <label className="dive-field">
            <span>Perceived effort <small>1 easy · 10 maximal</small></span>
            <select
              name="perceivedEffort"
              defaultValue={initialValues?.perceivedEffort ?? ""}
              aria-invalid={Boolean(state.fieldErrors.perceivedEffort)}
              required
            >
              <option value="" disabled>Choose 1–10</option>
              {Array.from({ length: 10 }, (_, index) => index + 1).map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
            <FieldError message={state.fieldErrors.perceivedEffort} />
          </label>

          <label className="dive-field">
            <span>Comfort <small>1 low · 5 high</small></span>
            <select
              name="comfort"
              defaultValue={initialValues?.comfort ?? ""}
              aria-invalid={Boolean(state.fieldErrors.comfort)}
              required
            >
              <option value="" disabled>Choose 1–5</option>
              {Array.from({ length: 5 }, (_, index) => index + 1).map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
            <FieldError message={state.fieldErrors.comfort} />
          </label>
        </div>

        <label className="dive-field dive-notes-field">
          <span>Notes <small>Optional</small></span>
          <textarea
            name="notes"
            maxLength={2000}
            rows={5}
            placeholder="How the dive felt, what worked, or what you would change."
            defaultValue={initialValues?.notes ?? ""}
            aria-invalid={Boolean(state.fieldErrors.notes)}
          />
          <FieldError message={state.fieldErrors.notes} />
        </label>
      </section>

      {state.error ? <p className="form-error dive-form-error" role="alert">{state.error}</p> : null}

      <div className="dive-form-actions">
        <Link href="/app/log" className="dive-button dive-button-secondary">Cancel</Link>
        <button className="dive-button dive-button-primary" type="submit" disabled={pending}>
          {pending ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
