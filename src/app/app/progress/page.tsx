import ComfortTrend from "@/components/progress/comfort-trend";
import DepthTrend from "@/components/progress/depth-trend";
import DisciplineBreakdown from "@/components/progress/discipline-breakdown";
import ProgressEmptyState from "@/components/progress/progress-empty-state";
import ProgressSummary from "@/components/progress/progress-summary";
import RecentActivity from "@/components/progress/recent-activity";
import TrainingConsistency from "@/components/progress/training-consistency";
import { getProgressDashboard } from "@/db/progress";
import { requireCurrentUser } from "@/lib/auth-session";

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
                comfortSeries={dashboard.comfortSeries}
                averageComfort={dashboard.diveMetrics.averageComfort}
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
          <RecentActivity activity={dashboard.recentActivity} />
        </>
      )}
    </section>
  );
}
