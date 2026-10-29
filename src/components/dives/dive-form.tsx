"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import type { DiveActionState } from "@/app/app/log/actions";
import EquipmentPicker from "@/components/dives/equipment-picker";
import { ChoiceGroup, FieldError, RatingScale, Switch, TextArea, TextField } from "@/components/ui/form";
import { Icon } from "@/components/ui/icons";
import { keepValuesOnSubmit } from "@/components/ui/keep-values-on-submit";
import { disciplineLabels, diveDisciplines } from "@/lib/profile-options";
import {
  currentOptions,
  mentalPreparationOptions,
  notableEventOptions,
  visibilityOptions,
  waterConditions,
  type DiveFormInput,
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
  cancelHref?: string;
};

const STEPS = [
  { title: "The dive", short: "Session", sub: "Where, what and how deep." },
  { title: "Conditions & gear", short: "Conditions & gear", sub: "What the water was like and what you wore." },
  { title: "Body & feel", short: "Body & feel", sub: "How the dive felt to you." },
  { title: "Prep & notes", short: "Prep & notes", sub: "Last step — what you did beforehand and anything worth remembering." },
] as const;

// Which step shows each server-side field error, so a failed save jumps to the right place.
const FIELD_STEP: Partial<Record<keyof DiveFormInput, number>> = {
  diveDate: 0, diveTime: 0, location: 0, discipline: 0, depthMeters: 0, durationMinutes: 0, durationRemainderSeconds: 0, isPersonalBest: 0,
  waterCondition: 1, visibility: 1, currentStrength: 1, equipment: 1,
  preDiveNerves: 2, calmAtDepth: 2, focus: 2, equalization: 2, overallFeel: 2, comfort: 2, perceivedEffort: 2,
  mentalPreparation: 3, notableEvent: 3, notes: 3,
};

function localToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function DepthStepper({ defaultValue, error }: { defaultValue: number | ""; error?: string }) {
  const input = useRef<HTMLInputElement>(null);
  function step(by: number) {
    const el = input.current;
    if (!el) return;
    el.value = String(Math.min(300, Math.max(0, (Number(el.value) || 0) + by)));
  }
  return (
    <div className="ui-panel">
      <span id="depth-label">Max depth (m)</span>
      <div className="ui-stepper">
        <button type="button" className="ui-icon-btn" aria-label="Decrease max depth" onClick={() => step(-1)}><Icon name="minus" /></button>
        <input ref={input} type="number" name="depthMeters" inputMode="decimal" min={0} max={300} step={0.1} defaultValue={defaultValue} aria-labelledby="depth-label" aria-invalid={error ? true : undefined} required placeholder="0" />
        <button type="button" className="ui-icon-btn" aria-label="Increase max depth" onClick={() => step(1)}><Icon name="plus" /></button>
      </div>
      <FieldError message={error} />
    </div>
  );
}

export default function DiveForm({ action, initialValues, submitLabel, cancelHref = "/app/log" }: DiveFormProps) {
  const [step, setStep] = useState(0);
  // after a failed save, jump to the first step that has an error
  const [state, formAction, pending] = useActionState(async (previous: DiveActionState, formData: FormData) => {
    const next = await action(previous, formData);
    const failed = Object.keys(next.fieldErrors).map((f) => FIELD_STEP[f as keyof DiveFormInput] ?? 0);
    if (failed.length) setStep(Math.min(...failed));
    return next;
  }, initialDiveActionState);
  const form = useRef<HTMLFormElement>(null);
  const errors = state.fieldErrors;
  const v = initialValues;

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    window.scrollTo({ top: 0 });
    form.current?.querySelector<HTMLElement>(`[data-step="${step}"] h1`)?.focus();
  }, [step]);

  function next() {
    // browser validation for the current step only; the server validates everything again on save
    const panel = form.current?.querySelector<HTMLElement>(`[data-step="${step}"]`);
    const invalid = Array.from(panel?.querySelectorAll<HTMLInputElement>("input, textarea") ?? []).find((el) => !el.checkValidity());
    if (invalid) { invalid.reportValidity(); return; }
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  }

  const minutes = v ? Math.floor(v.durationSeconds / 60) : "";
  const seconds = v ? v.durationSeconds % 60 : "";

  return (
    <form ref={form} action={formAction} onSubmit={keepValuesOnSubmit(formAction)} className="ui-flow" noValidate>
      <div className="ui-flow-top ui-stack">
        <Link href={cancelHref} className="ui-link"><Icon name="back" size={18} /> Log a session</Link>
        <div className="ui-progress" role="progressbar" aria-label="Log progress" aria-valuemin={1} aria-valuemax={4} aria-valuenow={step + 1}>
          {STEPS.map((s, i) => <span key={s.short} className={i <= step ? "on" : undefined} />)}
        </div>
      </div>

      <div className="ui-stack">
        {state.error ? <p className="ui-banner ui-banner-error" role="alert">{state.error}</p> : null}

        {STEPS.map((s, i) => (
          <div key={s.short} data-step={i} className="ui-flow-panel" hidden={i !== step}>
            <header className="ui-head">
              <div>
                <span className="ui-eyebrow">Step {i + 1} of 4</span>
                <h1 className="ui-title" tabIndex={-1}>{s.title}</h1>
                <p className="ui-sub">{s.sub}</p>
              </div>
            </header>

            {i === 0 ? (
              <section className="ui-section">
                <h2 className="ui-label">Session</h2>
                <div className="ui-card ui-stack">
                  <div className="ui-fields-2">
                    <TextField label="Date" type="date" name="diveDate" max={localToday()} defaultValue={v?.diveDate ?? localToday()} required error={errors.diveDate} />
                    <TextField label="Time" optional type="time" name="diveTime" defaultValue={v?.diveTime ?? ""} error={errors.diveTime} />
                  </div>
                  <TextField label="Location" optional name="location" maxLength={200} defaultValue={v?.location ?? ""} placeholder="e.g. Blue Hole, Dahab" error={errors.location} />
                  <ChoiceGroup legend="Discipline" name="discipline" required value={v?.discipline ?? "constant_weight"} error={errors.discipline}
                    options={diveDisciplines.map((d) => ({ value: d, label: disciplineLabels[d] }))} />
                  <div className="ui-fields-2">
                    <DepthStepper defaultValue={v?.depthMeters ?? ""} error={errors.depthMeters} />
                    <div className="ui-panel">
                      <span id="time-label">Dive time (m:ss)</span>
                      <div className="ui-duration" role="group" aria-labelledby="time-label">
                        <input type="number" name="durationMinutes" min={0} max={719} inputMode="numeric" defaultValue={minutes} aria-label="Minutes" required placeholder="0" />
                        <span aria-hidden="true">:</span>
                        <input type="number" name="durationRemainderSeconds" min={0} max={59} inputMode="numeric" defaultValue={seconds === "" ? "" : String(seconds).padStart(2, "0")} aria-label="Seconds" required placeholder="00" />
                      </div>
                      <FieldError message={errors.durationMinutes ?? errors.durationRemainderSeconds} />
                    </div>
                  </div>
                  <Switch name="isPersonalBest" label="Discipline PB?" hint="Mark if this beat your best" defaultChecked={v?.isPersonalBest} />
                </div>
              </section>
            ) : null}

            {i === 1 ? (
              <>
                <section className="ui-section">
                  <h2 className="ui-label">In the water</h2>
                  <div className="ui-card ui-stack">
                    <ChoiceGroup variant="seg" legend="Water" name="waterCondition" options={waterConditions} value={v?.waterCondition} error={errors.waterCondition} />
                    <ChoiceGroup variant="seg" legend="Visibility" name="visibility" options={visibilityOptions} value={v?.visibility} error={errors.visibility} />
                    <ChoiceGroup variant="seg" legend="Current" name="currentStrength" options={currentOptions} value={v?.currentStrength} error={errors.currentStrength} />
                  </div>
                </section>
                <section className="ui-section">
                  <h2 className="ui-label">Equipment</h2>
                  <div className="ui-card"><EquipmentPicker defaultValue={v?.equipment ?? null} error={errors.equipment} /></div>
                </section>
              </>
            ) : null}

            {i === 2 ? (
              <>
                <section className="ui-section">
                  <h2 className="ui-label">How it felt</h2>
                  <div className="ui-card ui-stack">
                    <RatingScale legend="Comfort" name="comfort" value={v?.comfort} low="Uncomfortable" high="Comfortable" required error={errors.comfort} />
                    <RatingScale legend="Perceived effort" name="perceivedEffort" max={10} value={v?.perceivedEffort} low="Easy" high="Maximal" required error={errors.perceivedEffort} />
                    <RatingScale legend="Pre-dive nerves" name="preDiveNerves" value={v?.preDiveNerves} low="Calm" high="Nervous" error={errors.preDiveNerves} />
                    <RatingScale legend="Calm at depth" name="calmAtDepth" value={v?.calmAtDepth} low="Anxious" high="Calm" error={errors.calmAtDepth} />
                    <RatingScale legend="Focus" name="focus" value={v?.focus} low="Scattered" high="Locked-in" error={errors.focus} />
                    <RatingScale legend="Equalization" name="equalization" value={v?.equalization} low="Struggled" high="Easy" error={errors.equalization} />
                    <RatingScale legend="Overall feel" name="overallFeel" value={v?.overallFeel} low="Rough" high="Great" error={errors.overallFeel} />
                  </div>
                </section>
              </>
            ) : null}

            {i === 3 ? (
              <>
                <section className="ui-section">
                  <h2 className="ui-label">Mental prep beforehand</h2>
                  <div className="ui-card">
                    <ChoiceGroup legend="Select any that you did before this dive." name="mentalPreparation" multiple options={mentalPreparationOptions} value={v?.mentalPreparation ?? []} error={errors.mentalPreparation} />
                  </div>
                </section>
                <section className="ui-section">
                  <h2 className="ui-label">Anything notable?</h2>
                  <div className="ui-card">
                    <ChoiceGroup legend="Pick the one that fits best." name="notableEvent" options={notableEventOptions} value={v?.notableEvent ?? "Nothing notable"} error={errors.notableEvent} />
                  </div>
                </section>
                <section className="ui-section">
                  <div className="ui-card">
                    <TextArea label="Notes" optional name="notes" rows={4} maxLength={2000} defaultValue={v?.notes ?? ""} placeholder="How did the dive feel? Anything you want to remember…" error={errors.notes} />
                  </div>
                </section>
              </>
            ) : null}
          </div>
        ))}

        <div className="ui-actionbar">
          <Link href={cancelHref} className="ui-link ui-discard">Cancel and discard</Link>
          {step > 0 ? (
            <button type="button" className="ui-btn ui-btn-ghost" onClick={() => setStep((s) => s - 1)}><Icon name="back" size={18} /> Back</button>
          ) : (
            <Link href={cancelHref} className="ui-btn ui-btn-ghost ui-hide-desktop">Cancel</Link>
          )}
          {step < STEPS.length - 1 ? (
            <button type="button" className="ui-btn ui-btn-primary" onClick={next}>Continue <Icon name="next" size={18} /></button>
          ) : (
            <button type="submit" className="ui-btn ui-btn-primary" disabled={pending}><Icon name="check" size={18} /> {pending ? "Saving…" : submitLabel}</button>
          )}
        </div>
      </div>

      <aside className="ui-flow-aside ui-card ui-stack" aria-label="Steps">
        <h2 className="ui-label">Step {step + 1} of 4</h2>
        <ol className="ui-steps-list">
          {STEPS.map((s, i) => (
            <li key={s.short} aria-current={i === step ? "step" : undefined} className={i < step ? "done" : undefined}>
              {i < step ? <button type="button" onClick={() => setStep(i)}><span>{i + 1}</span>{s.short}</button> : <><span>{i + 1}</span>{s.short}</>}
            </li>
          ))}
        </ol>
      </aside>
    </form>
  );
}
