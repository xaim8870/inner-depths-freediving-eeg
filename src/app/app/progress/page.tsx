import ComfortTrend from "@/components/progress/comfort-trend";
import DepthTrend from "@/components/progress/depth-trend";
import DisciplineBreakdown from "@/components/progress/discipline-breakdown";
import ProgressEmptyState from "@/components/progress/progress-empty-state";
import ProgressSummary from "@/components/progress/progress-summary";
import RecentActivity from "@/components/progress/recent-activity";
import TrainingConsistency from "@/components/progress/training-consistency";
import { getProgressDashboard } from "@/db/progress";
import { requireCurrentUser } from "@/lib/auth-session";
import Link from "next/link";

export default async function ProgressPage() {
  const user = await requireCurrentUser();
  const dashboard = await getProgressDashboard(user.id);
  const hasDives = dashboard.diveMetrics.totalDives > 0;
  const hasTraining = dashboard.trainingMetrics.totalTrainingSessions > 0;

  return (
    <section className="progress-page">
      <header className="progress-page-header">
        <div className="progress-eyebrow">Your data</div>
        <h1>Progress</h1>
        <p>A factual view of the dives and training sessions you have logged.</p>
      </header>

      {!hasDives && !hasTraining ? (
        <ProgressEmptyState />
      ) : (
        <>
          <ProgressSummary
            diveMetrics={dashboard.diveMetrics}
            trainingMetrics={dashboard.trainingMetrics}
          />
          {hasDives ? (
            <>
              <DepthTrend
                depthSeries={dashboard.depthSeries}
                divesLast30Days={dashboard.diveMetrics.divesLast30Days}
              />
              <ComfortTrend
                overallFeelSeries={dashboard.overallFeelSeries}
                averageOverallFeel={dashboard.diveMetrics.averageOverallFeel}
              />
              <DisciplineBreakdown breakdown={dashboard.disciplineBreakdown} />
            </>
          ) : null}
          {hasTraining ? (
            <TrainingConsistency
              frequency={dashboard.trainingFrequency}
              sessionsLast30Days={dashboard.trainingMetrics.trainingSessionsLast30Days}
              mostFrequentType={dashboard.trainingMetrics.mostFrequentTrainingType}
            />
          ) : null}
          {dashboard.ratingAverages.ratedDiveCount > 0 ? <section className="progress-section" aria-labelledby="ratings-progress-heading">
            <div className="progress-section-heading"><div><span>Logged ratings</span><h2 id="ratings-progress-heading">Dive experience</h2></div><div className="progress-stat-pill">Descriptive</div></div>
            <div className="progress-panel"><div className="progress-rating-grid">{[
              ["Overall feel", dashboard.ratingAverages.overallFeel], ["Calm at depth", dashboard.ratingAverages.calmAtDepth], ["Focus", dashboard.ratingAverages.focus], ["Equalization", dashboard.ratingAverages.equalization],
            ].map(([label, value]) => value === null ? null : <div key={String(label)}><strong>{Number(value).toFixed(1)}/5</strong><span>{label}</span></div>)}</div><p className="progress-data-note">Averages from your own logged ratings. Exploratory and correlational only; they do not show cause and effect.</p></div>
          </section> : null}
          <RecentActivity activity={dashboard.recentActivity} />
        </>
      )}
      <section className="progress-section" aria-labelledby="profile-progress-heading">
        <div className="progress-section-heading"><div><span>Baseline</span><h2 id="profile-progress-heading">Performance Profile</h2></div></div>
        <div className="progress-panel">
          {dashboard.performanceProfile ? <><strong>{dashboard.performanceProfile.dominantLabel}</strong><p className="progress-data-note">Completed {dashboard.performanceProfile.completedAt.toLocaleDateString("en-GB")}. This describes tendencies and does not diagnose performance or health.</p><Link href="/app/performance-profile" className="training-button training-button-secondary">View profile</Link></> : <><strong>Not completed</strong><p className="progress-data-note">Complete the assessment to add your mental-training baseline here.</p><Link href="/app/performance-profile" className="training-button training-button-secondary">Complete Performance Profile</Link></>}
        </div>
      </section>
    </section>
  );
}
