import { ButtonLink, PageHead, SafetyNote } from "@/components/ui/page";

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
      <ButtonLink href={backHref} variant="ghost" icon="back">Return to Inner Depths</ButtonLink>
      <SafetyNote />
    </div>
  );
}
