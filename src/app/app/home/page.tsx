import HomeIntro from "@/components/home/home-intro";
import DiveSummary from "@/components/home/dive-summary";
import RecentDives from "@/components/home/recent-dives";
import TrainingSummary from "@/components/home/training-summary";
import WhoopStatus from "@/components/home/whoop-status";
import TrainingStatus from "@/components/home/training-status";
import DescriptiveInsight from "@/components/home/descriptive-insight";
import OverallFeelChart from "@/components/home/overall-feel-chart";
import EmptyDiveState from "@/components/dives/empty-dive-state";
import { getHomeDashboard } from "@/db/home";
import { requireCurrentUser } from "@/lib/auth-session";

export default async function HomePage() {
  const user = await requireCurrentUser();
  const home = await getHomeDashboard(user.id);
  const dashboard = home.dive;

  return (
    <>
      <HomeIntro displayName={home.profile?.displayName ?? user.name} />
      <WhoopStatus connected={home.whoopConnected} />
      {dashboard.totalDives === 0 ? (
        <EmptyDiveState />
      ) : (
        <>
          <DiveSummary
            totalDives={dashboard.totalDives}
            deepestDive={dashboard.deepestDive}
            divesLast30Days={dashboard.divesLast30Days}
            averageComfort={dashboard.averageComfort}
          />
          <RecentDives
            latestDive={dashboard.latestDive}
            recentDives={dashboard.recentDives}
          />
        </>
      )}
      <TrainingSummary
        sessionsLast30Days={home.training.sessionsLast30Days}
        latestSession={home.training.latestSession}
      />
      <TrainingStatus goals={home.goals.map((goal) => goal.goal)} performanceProfile={home.performanceProfile} />
      <DescriptiveInsight values={home.overallFeelSeries.map((point) => point.value)} />
      <OverallFeelChart points={home.overallFeelSeries} />
    </>
  );
}
