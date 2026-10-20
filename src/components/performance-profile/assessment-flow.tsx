"use client";

import { useActionState, useMemo, useState } from "react";
import { submitPerformanceProfile, type AssessmentActionState } from "@/app/app/performance-profile/actions";
import { assessmentGoals, assessmentItems, assessmentScale, stateItems, styleItems } from "@/lib/performance-profile/definitions";

type Step = "intro" | "goal" | "statements" | "style" | "state";
const steps: Step[] = ["intro", "goal", "statements", "style", "state"];

export default function AssessmentFlow({ firstName }: { firstName: string }) {
  const [step, setStep] = useState<Step>("intro");
  const [goal, setGoal] = useState("");
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [stateResponses, setStateResponses] = useState<Record<string, number>>({});
  const [startedAt] = useState(() => new Date().toISOString());
  const [actionState, formAction, pending] = useActionState<AssessmentActionState, FormData>(submitPerformanceProfile, { error: "" });
  const currentIndex = steps.indexOf(step);
  const answeredStatements = useMemo(() => assessmentItems.filter((item) => responses[item.id] !== undefined).length, [responses]);
  const answeredStyle = useMemo(() => styleItems.filter((item) => responses[item.id] !== undefined).length, [responses]);
  const answeredState = useMemo(() => stateItems.filter((item) => stateResponses[item.id] !== undefined).length, [stateResponses]);

  const next = (target: Step) => { setStep(target); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const rating = (itemId: string, value: number) => setResponses((current) => ({ ...current, [itemId]: value }));

  if (step === "intro") return <section className="assessment-card assessment-intro">
    <div className="assessment-eyebrow">Performance Profile</div>
    <h1>Map where to focus your mental training</h1>
    <p>Hi {firstName}. This takes about 10 minutes. You’ll answer short statements, choose a goal, and check in on how you feel right now. There are no right answers.</p>
    <div className="assessment-notice">This describes tendencies for dry preparation. It is not a medical assessment and never replaces in-water instruction or safety supervision.</div>
    <button className="assessment-primary" type="button" onClick={() => next("goal")}>Begin</button>
  </section>;

  return <form action={formAction} className="assessment-flow">
    <input type="hidden" name="goal" value={goal} />
    <input type="hidden" name="responses" value={JSON.stringify(responses)} />
    <input type="hidden" name="stateResponses" value={JSON.stringify(stateResponses)} />
    <input type="hidden" name="startedAt" value={startedAt} />
    <div className="assessment-progress" aria-label={`Step ${currentIndex} of 4`}><i style={{ width: `${currentIndex * 23}%` }} /></div>

    {step === "goal" ? <section>
      <div className="assessment-eyebrow">Step 1 of 4 · Your goal</div><h1>What do you most want to work on?</h1>
      <p className="assessment-lead">Pick the one that fits best right now. It frames the rest — you can’t get it wrong.</p>
      <div className="assessment-goals">{assessmentGoals.map((item) => <button type="button" className={goal === item.id ? "selected" : ""} onClick={() => setGoal(item.id)} key={item.id}><span>{item.label}</span><i /></button>)}</div>
      <button className="assessment-primary" type="button" disabled={!goal} onClick={() => next("statements")}>Continue</button>
    </section> : null}

    {step === "statements" ? <section>
      <div className="assessment-eyebrow">Step 2 of 4 · Statements</div><h1>How much does each fit you?</h1>
      <p className="assessment-lead">Think about your typical dry training and pre-dive experience.</p>
      {assessmentItems.map((item) => <Question key={item.id} itemId={item.id} text={item.text} value={responses[item.id]} onChange={(value) => rating(item.id, value)} tag={("provisional" in item && item.provisional) ? "Provisional item" : item.source === "original" ? "App-original" : item.source === "adapted" ? "Adapted" : "Published"} />)}
      <button className="assessment-primary" type="button" disabled={answeredStatements !== assessmentItems.length} onClick={() => next("style")}>{answeredStatements === assessmentItems.length ? "Continue" : `${answeredStatements} / ${assessmentItems.length} answered`}</button>
    </section> : null}

    {step === "style" ? <section>
      <div className="assessment-eyebrow">Step 3 of 4 · Style</div><h1>A few more, about your style</h1>
      <p className="assessment-lead">No style is better than another — these only shape how the profile fits you.</p>
      {styleItems.map((item) => <Question key={item.id} itemId={item.id} text={item.text} value={responses[item.id]} onChange={(value) => rating(item.id, value)} />)}
      <button className="assessment-primary" type="button" disabled={answeredStyle !== styleItems.length} onClick={() => next("state")}>{answeredStyle === styleItems.length ? "Continue" : `${answeredStyle} / ${styleItems.length} answered`}</button>
    </section> : null}

    {step === "state" ? <section>
      <div className="assessment-eyebrow">Step 4 of 4 · Right now</div><h1>How are you arriving today?</h1>
      <p className="assessment-lead">A quick check-in on your current state.</p>
      <div className="assessment-state-list">{stateItems.map((item) => <fieldset key={item.id}><legend>{item.label}</legend><div className="assessment-scale compact">{assessmentScale.map((option) => <label className={stateResponses[item.id] === option.value ? "selected" : ""} key={option.value}><input type="radio" name={`state-${item.id}`} checked={stateResponses[item.id] === option.value} onChange={() => setStateResponses((current) => ({ ...current, [item.id]: option.value }))} /><span>{option.value}</span></label>)}</div><div className="assessment-scale-ends"><span>{item.low}</span><span>{item.high}</span></div></fieldset>)}</div>
      {actionState.error ? <p className="assessment-error" role="alert">{actionState.error}</p> : null}
      <button className="assessment-primary" type="submit" disabled={pending || answeredState !== stateItems.length}>{pending ? "Saving profile…" : answeredState === stateItems.length ? "Finish & submit" : `${answeredState} / ${stateItems.length} completed`}</button>
    </section> : null}
  </form>;
}

function Question({ itemId, text, value, onChange, tag }: { itemId: string; text: string; value?: number; onChange: (value: number) => void; tag?: string }) {
  return <fieldset className="assessment-question"><legend>{text}</legend>{tag ? <small>{tag}</small> : null}<div className="assessment-scale">{assessmentScale.map((option) => <label className={value === option.value ? "selected" : ""} key={option.value}><input type="radio" name={`answer-${itemId}`} value={option.value} checked={value === option.value} onChange={() => onChange(option.value)} /><span>{option.label}</span></label>)}</div></fieldset>;
}
