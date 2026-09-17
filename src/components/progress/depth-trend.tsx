import LineTrendChart from "@/components/progress/line-trend-chart";
import type { ProgressDashboard } from "@/db/progress";

export default function DepthTrend({
  depthSeries,
  divesLast30Days,
}: {
  depthSeries: ProgressDashboard["depthSeries"];
  divesLast30Days: number;
}) {
  return (
    <section className="progress-section" aria-labelledby="depth-trend-heading">
      <div className="progress-section-heading">
        <div>
          <span>Dive trend</span>
          <h2 id="depth-trend-heading">Depth over time</h2>
        </div>
        <div className="progress-stat-pill">{divesLast30Days} in 30 days</div>
      </div>
      <div className="progress-panel">
        {depthSeries.length >= 2 ? (
          <LineTrendChart points={depthSeries} label="Recorded dive depth over time" valueSuffix=" m" />
        ) : (
          <div className="progress-more-data">
            <strong>More data needed</strong>
            <p>Log another dive to begin showing a depth trend.</p>
          </div>
        )}
        <p className="progress-data-note">Recorded maximum depth for each logged dive, shown chronologically.</p>
      </div>
    </section>
  );
}
