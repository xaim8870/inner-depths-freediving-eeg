import LineTrendChart from "@/components/progress/line-trend-chart";
import type { ProgressDashboard } from "@/db/progress";

export default function ComfortTrend({
  overallFeelSeries,
  averageOverallFeel,
}: {
  overallFeelSeries: ProgressDashboard["overallFeelSeries"];
  averageOverallFeel: number | null;
}) {
  if (overallFeelSeries.length === 0) return null;

  return (
    <section className="progress-section" aria-labelledby="comfort-trend-heading">
      <div className="progress-section-heading">
        <div>
          <span>Self-report</span>
          <h2 id="comfort-trend-heading">Overall dive feel</h2>
        </div>
        <div className="progress-stat-pill">Avg {averageOverallFeel?.toFixed(1)}/5</div>
      </div>
      <div className="progress-panel">
        {overallFeelSeries.length >= 2 ? (
          <LineTrendChart
            points={overallFeelSeries}
            label="Reported overall dive feel over time"
            color="#46b3a9"
            domain={[1, 5]}
            valueSuffix="/5"
          />
        ) : (
          <div className="progress-more-data">
            <strong>More data needed</strong>
            <p>Add another overall-feel rating to begin showing a trend.</p>
          </div>
        )}
        <p className="progress-data-note">Your own post-dive overall-feel ratings, without interpretation or prediction.</p>
      </div>
    </section>
  );
}
