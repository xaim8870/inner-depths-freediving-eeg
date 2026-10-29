import { More } from "@/components/ui/disclosure";

// Destructive actions stay folded away so they never compete with the page's Save.
export default function DangerZone({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="ui-card" aria-label={title}>
      <More summary={title} plain>
        <p className="ui-sub">This permanently removes it from your history.</p>
        <div>{children}</div>
      </More>
    </section>
  );
}
