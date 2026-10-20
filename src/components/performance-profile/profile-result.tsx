import Link from "next/link";
import type { PerformanceProfileResult } from "@/lib/performance-profile/scoring";

const programNames: Record<string, string> = {
  nerves: "Dive-day nerves", confidence: "Confidence & self-belief", fear: "Fear & avoidance",
  panic: "Body sensations & panic literacy", focus: "Focus & overthinking",
  setback: "Setback recovery", foundational: "Foundational mental skills",
};

export default function ProfileResult({ result, completedAt }: { result: PerformanceProfileResult; completedAt: Date }) {
  return <section className="profile-result">
    <header className="profile-result-hero"><div className="assessment-eyebrow">Your Performance Profile</div><h1>{result.pathways.blend ? "A balanced profile" : result.dominant.label}</h1><p>{result.pathways.blend ? result.plan.note : result.dominant.lead}</p><small>Completed {completedAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</small></header>
    <section className="profile-result-card"><div className="section-title-row"><h2>Pathway pattern</h2><span>Tendencies</span></div><div className="profile-pathways">{result.pathways.ranked.map((pathway) => <div key={pathway.id}><div><span>{pathway.label}</span><b>{pathway.pct}%</b></div><i><span style={{ width: `${pathway.pct}%`, background: pathway.colour }} /></i></div>)}</div><p className="profile-caption">These relative scores guide the reference routing model. They are not a diagnosis or a measure of ability.</p></section>
    <section className="profile-result-card"><div className="section-title-row"><h2>What drove this result</h2><span>Top signals</span></div><div className="profile-drivers">{result.drivers.slice(0, 3).map((driver) => <div key={driver.label}><strong>{driver.label}</strong><span>{driver.value.toFixed(1)} / 5</span></div>)}</div></section>
    <section className="profile-result-card accent"><div className="assessment-eyebrow">Training direction</div><h2>{programNames[result.plan.program] ?? result.plan.program}</h2><p>{result.plan.note}</p><small>{result.plan.basis.replaceAll("+", " + ")} · derived from assessment v12</small></section>
    <section className="profile-result-card"><div className="section-title-row"><h2>Your style</h2><span>Descriptive</span></div><div className="profile-style-list">{result.style.map((style) => <div key={style.dimension}><strong>{style.title}</strong><div><span>{style.low}</span><i><b style={{ left: `${style.position}%` }} /></i><span>{style.high}</span></div><p>{style.strength}</p>{style.skill ? <p className="profile-style-fit"><strong>Training fit</strong>{style.skill}</p> : null}</div>)}</div></section>
    {result.modifiers.length ? <section className="profile-result-card"><div className="section-title-row"><h2>Supporting details</h2><span>Context</span></div>{result.modifiers.map((modifier, index) => <p className="profile-modifier" key={`${modifier.tag}-${index}`}><strong>{modifier.tag}</strong>{modifier.text}</p>)}</section> : null}
    <div className="profile-result-actions"><Link href="/app/train" className="assessment-primary">View training</Link><Link href="/app/performance-profile?retake=1" className="assessment-secondary">Retake assessment</Link></div>
    <p className="assessment-notice">{result.safety}</p>
  </section>;
}
