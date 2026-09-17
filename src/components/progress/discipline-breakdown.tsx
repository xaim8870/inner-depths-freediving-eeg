import type { ProgressDashboard } from "@/db/progress";
import { disciplineLabels } from "@/lib/profile-options";

export default function DisciplineBreakdown({
  breakdown,
}: {
  breakdown: ProgressDashboard["disciplineBreakdown"];
}) {
  const total = breakdown.reduce((sum, item) => sum + item.count, 0);

  return (
    <section className="progress-section" aria-labelledby="discipline-breakdown-heading">
      <div className="progress-section-heading">
        <div>
          <span>Dive log</span>
          <h2 id="discipline-breakdown-heading">Discipline breakdown</h2>
        </div>
      </div>
      <div className="progress-panel discipline-breakdown">
        {breakdown.map((item) => (
          <div className="discipline-row" key={item.discipline}>
            <div className="discipline-row-heading">
              <span>{disciplineLabels[item.discipline]}</span>
              <strong>{item.count}</strong>
            </div>
            <div className="discipline-track">
              <div style={{ width: `${(item.count / total) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
