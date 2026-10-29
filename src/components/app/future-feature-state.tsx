import Link from "next/link";
import { Icon } from "@/components/ui/icons";
import { PageHead, SafetyNote } from "@/components/ui/page";

export default function FutureFeatureState({ title, description, status = "Coming later", dependency, backHref = "/app/home" }: { title: string; description: string; status?: string; dependency?: string; backHref?: string }) {
  return (
    <div className="ui-page ui-page-narrow">
      <PageHead eyebrow={status} title={title} sub={description} />
      {dependency ? (
        <section className="ui-card ui-stack">
          <h2 className="ui-label">What it depends on</h2>
          <p className="ui-sub">{dependency}</p>
        </section>
      ) : null}
      <Link href={backHref} className="ui-link"><Icon name="back" size={18} /> Return to Inner Depths</Link>
      <SafetyNote />
    </div>
  );
}
