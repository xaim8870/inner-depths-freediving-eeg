import Link from "next/link";
import { PageHead, SafetyNote } from "@/components/ui/page";

const principles: Array<[string, string]> = [
  ["Never dive alone", "Always dive with a trained buddy watching you, every time."],
  ["Dry training only", "Inner Depths supports land-based training and pre-dive preparation. It never guides you in the water."],
  ["A record, not a prescription", "The app records what happened; it does not set, time or progress breath-hold targets."],
  ["Not medical advice", "Patterns are descriptive and correlational. Ask a doctor about health questions."],
];

export default function AboutPage() {
  return (
    <div className="ui-page ui-page-narrow">
      <PageHead eyebrow="Beyond training · about & safety" title="Our mission & impact"
        sub="Inner Depths helps freedivers keep a private record of completed diving and dry or pre-dive training. It does not replace an instructor, a trained buddy, supervision, or established freediving safety practice." />
      <section className="ui-section" id="safety">
        <h2 className="ui-label">Safety first</h2>
        <ul className="ui-card ui-list">
          {principles.map(([title, detail]) => <li key={title}><div className="ui-row"><span>{title}<small>{detail}</small></span></div></li>)}
        </ul>
      </section>
      <Link href="/privacy" className="ui-link">Read the privacy policy</Link>
      <SafetyNote />
    </div>
  );
}
