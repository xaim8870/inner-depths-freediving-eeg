"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { CompletedSessionActionState } from "@/app/app/log/sessions/actions";
import type { CompletedSession } from "@/db/completed-sessions";
import { completedSessionLabels, holdPositions, poolDisciplines, tableTypes, type CompletedSessionCategory } from "@/lib/completed-session-options";

const initialState: CompletedSessionActionState = { error: "", fieldErrors: {} };

function ErrorText({ message }: { message?: string }) {
  return message ? <p className="form-error">{message}</p> : null;
}

function Rating({ name, label, value, hint }: { name: "preSessionNerves" | "calmRating" | "focusRating" | "overallFeel" | "sessionEffort" | "urgeToBreathe"; label: string; value?: number | null; hint: string }) {
  return <label className="training-field"><span>{label} <small>{hint}</small></span><select name={name} defaultValue={value ?? ""}><option value="">Not rated</option>{[1,2,3,4,5].map((score) => <option key={score}>{score}</option>)}</select></label>;
}

export default function CompletedSessionForm({ category, action, initialValues }: {
  category: CompletedSessionCategory;
  action: (state: CompletedSessionActionState, formData: FormData) => Promise<CompletedSessionActionState>;
  initialValues?: CompletedSession;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const today = new Date().toISOString().slice(0, 10);
  return <form action={formAction} className="training-form" noValidate>
    <input type="hidden" name="sessionCategory" value={category} />
    <section className="training-form-card">
      <h2>Completed session</h2>
      <p className="form-section-copy">This records work already completed elsewhere. Inner Depths does not set, time, or progress breath-hold work.</p>
      <div className="training-field-grid training-field-grid-three">
        <label className="training-field"><span>Date</span><input type="date" name="sessionDate" max={today} defaultValue={initialValues?.sessionDate ?? today} required /><ErrorText message={state.fieldErrors.sessionDate} /></label>
        <label className="training-field"><span>Time <small>Optional</small></span><input type="time" name="sessionTime" defaultValue={initialValues?.sessionTime ?? ""} /><ErrorText message={state.fieldErrors.sessionTime} /></label>
        <label className="training-field"><span>Duration <small>Minutes</small></span><input type="number" name="durationMinutes" min="1" max="720" defaultValue={initialValues?.durationMinutes ?? ""} required /><ErrorText message={state.fieldErrors.durationMinutes} /></label>
      </div>
    </section>

    <section className="training-form-card">
      <h2>{completedSessionLabels[category]} details</h2>
      {category === "pool" ? <div className="training-field-grid">
        <label className="training-field"><span>Discipline</span><select name="poolDiscipline" defaultValue={initialValues?.poolDiscipline ?? ""} required><option value="" disabled>Choose</option>{poolDisciplines.map((item) => <option key={item}>{item}</option>)}</select><ErrorText message={state.fieldErrors.poolDiscipline} /></label>
        <label className="training-field"><span>Distance <small>m</small></span><input type="number" name="distanceMeters" min="1" max="5000" step="0.1" defaultValue={initialValues?.distanceMeters ?? ""} required /><ErrorText message={state.fieldErrors.distanceMeters} /></label>
        <label className="training-field"><span>Pool length</span><select name="poolLengthMeters" defaultValue={initialValues?.poolLengthMeters ?? ""} required><option value="" disabled>Choose</option><option value="25">25 m</option><option value="50">50 m</option></select><ErrorText message={state.fieldErrors.poolLengthMeters} /></label>
        <div><Rating name="sessionEffort" label="Session effort" hint="1 easy · 5 hard" value={initialValues?.sessionEffort} /><ErrorText message={state.fieldErrors.sessionEffort} /></div>
      </div> : null}
      {category === "dry_hold" ? <div className="training-field-grid">
        <label className="training-field"><span>Best hold <small>Seconds</small></span><input type="number" name="bestHoldSeconds" min="1" max="3600" defaultValue={initialValues?.bestHoldSeconds ?? ""} required /><ErrorText message={state.fieldErrors.bestHoldSeconds} /></label>
        <label className="training-field"><span>Number of holds</span><input type="number" name="holdCount" min="1" max="100" defaultValue={initialValues?.holdCount ?? ""} required /><ErrorText message={state.fieldErrors.holdCount} /></label>
        <label className="training-field"><span>Position</span><select name="holdPosition" defaultValue={initialValues?.holdPosition ?? ""} required><option value="" disabled>Choose</option>{holdPositions.map((item) => <option key={item}>{item}</option>)}</select><ErrorText message={state.fieldErrors.holdPosition} /></label>
        <div><Rating name="urgeToBreathe" label="Urge to breathe" hint="1 low · 5 high" value={initialValues?.urgeToBreathe} /><ErrorText message={state.fieldErrors.urgeToBreathe} /></div>
      </div> : null}
      {category === "table" ? <div className="training-field-grid training-field-grid-three">
        <label className="training-field"><span>Table type</span><select name="tableType" defaultValue={initialValues?.tableType ?? ""} required><option value="" disabled>Choose</option>{tableTypes.map((item) => <option key={item}>{item}</option>)}</select><ErrorText message={state.fieldErrors.tableType} /></label>
        <label className="training-field"><span>Rounds in table</span><input type="number" name="tableRounds" min="1" max="50" defaultValue={initialValues?.tableRounds ?? ""} required /><ErrorText message={state.fieldErrors.tableRounds} /></label>
        <label className="training-field"><span>Rounds completed</span><input type="number" name="completedRounds" min="0" max="50" defaultValue={initialValues?.completedRounds ?? ""} required /><ErrorText message={state.fieldErrors.completedRounds} /></label>
        <label className="training-field"><span>Hold per round <small>Seconds</small></span><input type="number" name="holdSeconds" min="1" max="3600" defaultValue={initialValues?.holdSeconds ?? ""} required /><ErrorText message={state.fieldErrors.holdSeconds} /></label>
        <label className="training-field"><span>Rest per round <small>Seconds</small></span><input type="number" name="restSeconds" min="0" max="3600" defaultValue={initialValues?.restSeconds ?? ""} required /><ErrorText message={state.fieldErrors.restSeconds} /></label>
      </div> : null}
    </section>

    <section className="training-form-card">
      <h2>How it felt</h2>
      <div className="training-field-grid">
        <Rating name="preSessionNerves" label="Pre-session nerves" hint="1 calm · 5 nervous" value={initialValues?.preSessionNerves} />
        <Rating name="calmRating" label="Calm" hint="1 anxious · 5 calm" value={initialValues?.calmRating} />
        <Rating name="focusRating" label="Focus" hint="1 scattered · 5 focused" value={initialValues?.focusRating} />
        <Rating name="overallFeel" label="Overall feel" hint="1 rough · 5 great" value={initialValues?.overallFeel} />
      </div>
      <label className="training-field"><span>Notes <small>Optional</small></span><textarea name="notes" rows={5} maxLength={2000} defaultValue={initialValues?.notes ?? ""} /><ErrorText message={state.fieldErrors.notes} /></label>
    </section>

    <label className="supervision-attestation"><input type="checkbox" name="supervisionAttested" /><span><strong>Someone was present and supervising.</strong> This is a retrospective record of a completed session.</span></label>
    <ErrorText message={state.fieldErrors.supervisionAttested} />
    {state.error ? <p className="form-error" role="alert">{state.error}</p> : null}
    <div className="training-form-actions"><Link href="/app/log" className="training-button training-button-secondary">Cancel</Link><button disabled={pending} className="training-button training-button-primary">{pending ? "Saving…" : initialValues ? "Save changes" : `Save ${completedSessionLabels[category].toLowerCase()}`}</button></div>
  </form>;
}

