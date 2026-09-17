import HomeHeader from "@/components/home/home-header";
import HomeIntro from "@/components/home/home-intro";
import DiveSummary from "@/components/home/dive-summary";
import RecentDives from "@/components/home/recent-dives";
import TrainingSummary from "@/components/home/training-summary";
import EmptyDiveState from "@/components/dives/empty-dive-state";
import { getHomeDiveDashboard } from "@/db/dives";
import { getHomeTrainingSummary } from "@/db/training-sessions";
import { getProfileForUser, requireCurrentUser } from "@/lib/auth-session";

export default async function HomePage() {
  const user = await requireCurrentUser();
  const [profile, dashboard, trainingSummary] = await Promise.all([
    getProfileForUser(user.id),
    getHomeDiveDashboard(user.id),
    getHomeTrainingSummary(user.id),
  ]);

  return (
    <>
      <HomeHeader />
      <HomeIntro displayName={profile?.displayName ?? user.name} />
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
        sessionsLast30Days={trainingSummary.sessionsLast30Days}
        latestSession={trainingSummary.latestSession}
      />
    </>
  );
}
