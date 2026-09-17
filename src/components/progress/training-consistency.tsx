import type { ProgressDashboard } from "@/db/progress";

function formatMonth(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "2-digit",
    timeZone: "UTC",
  }).format(new Date(`${value}-01T00:00:00Z`));
}

export default function TrainingConsistency({
  frequency,
  sessionsLast30Days,
  mostFrequentType,
}: {
  frequency: ProgressDashboard["trainingFrequency"];
  sessionsLast30Days: number;
  mostFrequentType: string | null;
}) {
  const maxCount = Math.max(...frequency.map((item) => item.count), 1);

  return (
    <section className="progress-section" aria-labelledby="training-consistency-heading">
      <div className="progress-section-heading">
        <div>
          <span>Training log</span>
          <h2 id="training-consistency-heading">Training consistency</h2>
        </div>
        <div className="progress-stat-pill">{sessionsLast30Days} in 30 days</div>
      </div>
      <div className="progress-panel">
        <div className="training-frequency-chart" role="img" aria-label={frequency.map((item) => `${formatMonth(item.month)}: ${item.count} sessions`).join(", ")}>
          {frequency.map((item) => (
            <div className="training-frequency-column" key={item.month}>
              <div className="training-frequency-value">{item.count}</div>
              <div className="training-frequency-track">
                <div style={{ height: `${Math.max((item.count / maxCount) * 100, 8)}%` }} />
              </div>
              <div className="training-frequency-label">{formatMonth(item.month)}</div>
            </div>
          ))}
        </div>
        <p className="progress-data-note">
          {mostFrequentType ? `Most frequently logged: ${mostFrequentType}. ` : ""}
          Monthly counts describe completed sessions only.
        </p>
      </div>
    </section>
  );
}
