"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { DiveActionState } from "@/app/app/log/actions";
import { disciplineLabels, diveDisciplines } from "@/lib/profile-options";
import {
  currentOptions,
  mentalPreparationOptions,
  notableEventOptions,
  visibilityOptions,
  waterConditions,
} from "@/lib/dive-validation";

const initialDiveActionState: DiveActionState = { error: "", fieldErrors: {} };

export type DiveFormValues = {
  diveDate: string;
  diveTime: string | null;
  discipline: (typeof diveDisciplines)[number];
  depthMeters: number;
  durationSeconds: number;
  location: string | null;
  perceivedEffort: number | null;
  comfort: number | null;
  isPersonalBest: boolean;
  waterCondition: string | null;
  visibility: string | null;
  currentStrength: string | null;
  equipment: string | null;
  preDiveNerves: number | null;
  calmAtDepth: number | null;
  focus: number | null;
  equalization: number | null;
  overallFeel: number | null;
  mentalPreparation: string[] | null;
  notableEvent: string | null;
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
          <label className="dive-field">
            <span>Time <small>Optional</small></span>
            <input type="time" name="diveTime" defaultValue={initialValues?.diveTime ?? ""} />
            <FieldError message={state.fieldErrors.diveTime} />
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
        <label className="dive-check-row">
          <input type="checkbox" name="isPersonalBest" defaultChecked={initialValues?.isPersonalBest} />
          <span>Discipline personal best</span>
        </label>
      </section>

      <section className="dive-form-card" aria-labelledby="conditions-heading">
        <h2 id="conditions-heading">Conditions &amp; equipment</h2>
        <div className="dive-field-grid dive-field-grid-three">
          {([
            ["waterCondition", "Water", waterConditions, initialValues?.waterCondition],
            ["visibility", "Visibility", visibilityOptions, initialValues?.visibility],
            ["currentStrength", "Current", currentOptions, initialValues?.currentStrength],
          ] as const).map(([name, label, options, value]) => (
            <label className="dive-field" key={name}>
              <span>{label} <small>Optional</small></span>
              <select name={name} defaultValue={value ?? ""}>
                <option value="">Not recorded</option>
                {options.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>
          ))}
        </div>
        <label className="dive-field">
          <span>Equipment / gear <small>Optional</small></span>
          <input name="equipment" maxLength={500} placeholder="Fins, wetsuit, weight setup" defaultValue={initialValues?.equipment ?? ""} />
          <FieldError message={state.fieldErrors.equipment} />
        </label>
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

        <div className="dive-rating-grid">
          {([
            ["preDiveNerves", "Pre-dive nerves", "1 calm · 5 nervous"],
            ["calmAtDepth", "Calm at depth", "1 anxious · 5 calm"],
            ["focus", "Focus", "1 scattered · 5 locked-in"],
            ["equalization", "Equalization", "1 struggled · 5 easy"],
            ["overallFeel", "Overall feel", "1 rough · 5 great"],
          ] as const).map(([name, label, hint]) => (
            <label className="dive-field" key={name}>
              <span>{label} <small>{hint}</small></span>
              <select name={name} defaultValue={initialValues?.[name] ?? ""}>
                <option value="">Not rated</option>
                {[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
              <FieldError message={state.fieldErrors[name]} />
            </label>
          ))}
        </div>

        <fieldset className="dive-fieldset">
          <legend>Mental preparation <small>Select any</small></legend>
          <div className="dive-discipline-options">
            {mentalPreparationOptions.map((option) => (
              <label key={option}>
                <input type="checkbox" name="mentalPreparation" value={option} defaultChecked={initialValues?.mentalPreparation?.includes(option)} />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="dive-field">
          <span>Anything notable? <small>Optional</small></span>
          <select name="notableEvent" defaultValue={initialValues?.notableEvent ?? ""}>
            <option value="">Not recorded</option>
            {notableEventOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>

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
