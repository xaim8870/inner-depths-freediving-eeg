"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { CompletedSessionActionState } from "@/app/app/log/sessions/actions";
import { ChoiceGroup, FieldError, TextArea, TextField } from "@/components/ui/form";
import { Icon } from "@/components/ui/icons";
import type { CompletedSession } from "@/db/completed-sessions";
import { completedSessionLabels, holdPositions, poolDisciplines, tableTypes, type CompletedSessionCategory } from "@/lib/completed-session-options";

const initialState: CompletedSessionActionState = { error: "", fieldErrors: {} };
const RATING = [{ value: "", label: "–" }, ...[1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: String(n) }))];

// Optional 1–5 rating; "–" keeps it unrated (the column is nullable).
function Rating({ name, label, value, hint, error }: { name: string; label: string; value?: number | null; hint: string; error?: string }) {
  return <ChoiceGroup variant="seg" legend={`${label} · ${hint}`} name={name} options={RATING} value={value == null ? "" : String(value)} error={error} />;
}

export default function CompletedSessionForm({ category, action, initialValues }: {
  category: CompletedSessionCategory;
  action: (state: CompletedSessionActionState, formData: FormData) => Promise<CompletedSessionActionState>;
  initialValues?: CompletedSession;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const errors = state.fieldErrors;
  const v = initialValues;
  const today = new Date().toISOString().slice(0, 10);
  const num = (n: number | null | undefined) => (n == null ? "" : n);

  return (
    <form action={formAction} className="ui-stack" noValidate>
      <input type="hidden" name="sessionCategory" value={category} />
      {state.error ? <p className="ui-banner ui-banner-error" role="alert">{state.error}</p> : null}

      <section className="ui-section">
        <h2 className="ui-label">Completed session</h2>
        <div className="ui-card ui-stack">
          <p className="ui-sub">This records work already completed elsewhere. Inner Depths does not set, time, or progress breath-hold work.</p>
          <div className="ui-fields-2">
            <TextField label="Date" type="date" name="sessionDate" max={today} defaultValue={v?.sessionDate ?? today} required error={errors.sessionDate} />
            <TextField label="Time" optional type="time" name="sessionTime" defaultValue={v?.sessionTime ?? ""} error={errors.sessionTime} />
          </div>
          <TextField label="Duration (minutes)" type="number" name="durationMinutes" min={1} max={720} inputMode="numeric" defaultValue={num(v?.durationMinutes)} required error={errors.durationMinutes} />
        </div>
      </section>

      <section className="ui-section">
        <h2 className="ui-label">{completedSessionLabels[category]} details</h2>
        <div className="ui-card ui-stack">
          {category === "pool" ? (
            <>
              <ChoiceGroup variant="seg" legend="Discipline" name="poolDiscipline" options={poolDisciplines} value={v?.poolDiscipline} required error={errors.poolDiscipline} />
              <div className="ui-fields-2">
                <TextField label="Distance (m)" type="number" name="distanceMeters" min={1} max={5000} step={0.1} inputMode="decimal" defaultValue={num(v?.distanceMeters)} required error={errors.distanceMeters} />
                <ChoiceGroup variant="seg" legend="Pool length" name="poolLengthMeters" options={[{ value: "25", label: "25 m" }, { value: "50", label: "50 m" }]} value={v?.poolLengthMeters ? String(v.poolLengthMeters) : null} required error={errors.poolLengthMeters} />
              </div>
              <Rating name="sessionEffort" label="Session effort" hint="1 easy · 5 hard" value={v?.sessionEffort} error={errors.sessionEffort} />
            </>
          ) : null}
          {category === "dry_hold" ? (
            <>
              <div className="ui-fields-2">
                <TextField label="Best hold (seconds)" type="number" name="bestHoldSeconds" min={1} max={3600} inputMode="numeric" defaultValue={num(v?.bestHoldSeconds)} required error={errors.bestHoldSeconds} />
                <TextField label="Number of holds" type="number" name="holdCount" min={1} max={100} inputMode="numeric" defaultValue={num(v?.holdCount)} required error={errors.holdCount} />
              </div>
              <ChoiceGroup variant="seg" legend="Position" name="holdPosition" options={holdPositions} value={v?.holdPosition} required error={errors.holdPosition} />
              <Rating name="urgeToBreathe" label="Urge to breathe" hint="1 low · 5 high" value={v?.urgeToBreathe} error={errors.urgeToBreathe} />
            </>
          ) : null}
          {category === "table" ? (
            <>
              <ChoiceGroup variant="seg" legend="Table type" name="tableType" options={tableTypes.map((t) => ({ value: t, label: t.replace("2", "₂") }))} value={v?.tableType} required error={errors.tableType} />
              <div className="ui-fields-2">
                <TextField label="Rounds in table" type="number" name="tableRounds" min={1} max={50} inputMode="numeric" defaultValue={num(v?.tableRounds)} required error={errors.tableRounds} />
                <TextField label="Rounds completed" type="number" name="completedRounds" min={0} max={50} inputMode="numeric" defaultValue={num(v?.completedRounds)} required error={errors.completedRounds} />
                <TextField label="Hold per round (s)" type="number" name="holdSeconds" min={1} max={3600} inputMode="numeric" defaultValue={num(v?.holdSeconds)} required error={errors.holdSeconds} />
                <TextField label="Rest per round (s)" type="number" name="restSeconds" min={0} max={3600} inputMode="numeric" defaultValue={num(v?.restSeconds)} required error={errors.restSeconds} />
              </div>
            </>
          ) : null}
        </div>
      </section>

      <section className="ui-section">
        <h2 className="ui-label">How it felt</h2>
        <div className="ui-card ui-stack">
          <Rating name="preSessionNerves" label="Pre-session nerves" hint="1 calm · 5 nervous" value={v?.preSessionNerves} error={errors.preSessionNerves} />
          <Rating name="calmRating" label="Calm" hint="1 anxious · 5 calm" value={v?.calmRating} error={errors.calmRating} />
          <Rating name="focusRating" label="Focus" hint="1 scattered · 5 focused" value={v?.focusRating} error={errors.focusRating} />
          <Rating name="overallFeel" label="Overall feel" hint="1 rough · 5 great" value={v?.overallFeel} error={errors.overallFeel} />
          <TextArea label="Notes" optional name="notes" rows={4} maxLength={2000} defaultValue={v?.notes ?? ""} error={errors.notes} />
        </div>
      </section>

      <div className="ui-card">
        <label className="ui-switch">
          <span>Someone was present and supervising.<small>Required — this is a retrospective record of a completed session.</small></span>
          <input type="checkbox" role="switch" name="supervisionAttested" defaultChecked={v?.supervisionAttested} />
        </label>
        <FieldError message={errors.supervisionAttested} />
      </div>

      <div className="ui-actions">
        <Link href="/app/log" className="ui-btn ui-btn-ghost">Cancel</Link>
        <button type="submit" disabled={pending} className="ui-btn ui-btn-primary"><Icon name="check" size={18} /> {pending ? "Saving…" : v ? "Save changes" : `Save ${completedSessionLabels[category].toLowerCase()}`}</button>
      </div>
    </form>
  );
}
