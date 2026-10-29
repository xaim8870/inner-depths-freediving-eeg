export default function DangerZone({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="ui-card ui-head" aria-label={title}>
      <div>
        <h2 className="ui-label">{title}</h2>
        <p className="ui-sub">This permanently removes it from your history.</p>
      </div>
      {children}
    </section>
  );
}
