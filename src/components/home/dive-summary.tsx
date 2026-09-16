import SectionHeading from "@/components/home/section-heading";

type DiveSummaryProps = {
  totalDives: number;
  deepestDive: number | null;
  divesLast30Days: number;
  averageComfort: number | null;
};

export default function DiveSummary({
  totalDives,
  deepestDive,
  divesLast30Days,
  averageComfort,
}: DiveSummaryProps) {
  const metrics = [
    { label: "Total dives", value: totalDives.toString(), detail: "All logged dives" },
    {
      label: "Deepest",
      value: deepestDive === null ? "—" : `${deepestDive.toFixed(1)} m`,
      detail: "Personal log maximum",
    },
    { label: "Last 30 days", value: divesLast30Days.toString(), detail: "Recent activity" },
    {
      label: "Avg comfort",
      value: averageComfort === null ? "—" : `${averageComfort.toFixed(1)}/5`,
      detail: averageComfort === null ? "No ratings yet" : "From rated dives",
    },
  ];

  return (
    <section aria-label="Dive summary">
      <SectionHeading>At a glance</SectionHeading>
      <div className="home-metric-grid">
        {metrics.map((metric) => (
          <article className="home-metric-card" key={metric.label}>
            <div className="home-metric-label">{metric.label}</div>
            <div className="home-metric-value">{metric.value}</div>
            <div className="home-metric-detail">{metric.detail}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
