import Link from "next/link";

export default function FutureFeatureState({ title, description, status = "Coming later", dependency, backHref = "/app/home" }: { title: string; description: string; status?: string; dependency?: string; backHref?: string }) {
  return <section className="future-page"><span className="future-kicker">{status}</span><h1>{title}</h1><p>{description}</p>{dependency ? <div className="future-dependency"><strong>Future dependency</strong><span>{dependency}</span></div> : null}<Link href={backHref} className="training-button training-button-secondary">Return to Inner Depths</Link></section>;
}

