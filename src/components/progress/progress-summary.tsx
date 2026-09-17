import type { ProgressDashboard } from "@/db/progress";

function formatMinutes(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder > 0 ? `${hours}h ${remainder}m` : `${hours}h`;
}

export default function ProgressSummary({
  diveMetrics,
  trainingMetrics,
}: Pick<ProgressDashboard, "diveMetrics" | "trainingMetrics">) {
  const metrics = [
    ...(diveMetrics.totalDives > 0 ? [
      { label: "Total dives", value: diveMetrics.totalDives.toString() },
      { label: "Deepest dive", value: `${diveMetrics.deepestDive?.toFixed(1)} m` },
      { label: "Average depth", value: `${diveMetrics.averageDepth?.toFixed(1)} m` },
      { label: "Total dive time", value: formatMinutes(Math.round(diveMetrics.totalDiveTimeSeconds / 60)) },
    ] : []),
    ...(trainingMetrics.totalTrainingSessions > 0 ? [
      { label: "Training sessions", value: trainingMetrics.totalTrainingSessions.toString() },
      { label: "Training time", value: formatMinutes(trainingMetrics.totalTrainingMinutes) },
    ] : []),
  ];

  return (
    <section aria-label="Progress summary" className="progress-summary-grid">
      {metrics.map((metric) => (
        <article className="progress-summary-card" key={metric.label}>
          <div className="progress-summary-value">{metric.value}</div>
          <div className="progress-summary-label">{metric.label}</div>
        </article>
      ))}
    </section>
  );
}
