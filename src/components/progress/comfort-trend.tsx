import LineTrendChart from "@/components/progress/line-trend-chart";
import type { ProgressDashboard } from "@/db/progress";

export default function ComfortTrend({
  comfortSeries,
  averageComfort,
}: {
  comfortSeries: ProgressDashboard["comfortSeries"];
  averageComfort: number | null;
}) {
  if (comfortSeries.length === 0) return null;

  return (
    <section className="progress-section" aria-labelledby="comfort-trend-heading">
      <div className="progress-section-heading">
        <div>
          <span>Self-report</span>
          <h2 id="comfort-trend-heading">Comfort trend</h2>
        </div>
        <div className="progress-stat-pill">Avg {averageComfort?.toFixed(1)}/5</div>
      </div>
      <div className="progress-panel">
        {comfortSeries.length >= 2 ? (
          <LineTrendChart
            points={comfortSeries}
            label="Reported dive comfort over time"
            color="#46b3a9"
            domain={[1, 5]}
            valueSuffix="/5"
          />
        ) : (
          <div className="progress-more-data">
            <strong>More data needed</strong>
            <p>Add another comfort rating to begin showing a trend.</p>
          </div>
        )}
        <p className="progress-data-note">Your own post-dive comfort ratings, without interpretation or prediction.</p>
      </div>
    </section>
  );
}
