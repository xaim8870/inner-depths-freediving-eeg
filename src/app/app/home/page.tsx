import HomeHeader from "@/components/home/home-header";
import HomeIntro from "@/components/home/home-intro";
import DiveSummary from "@/components/home/dive-summary";
import RecentDives from "@/components/home/recent-dives";
import EmptyDiveState from "@/components/dives/empty-dive-state";
import { getHomeDiveDashboard } from "@/db/dives";
import { getProfileForUser, requireCurrentUser } from "@/lib/auth-session";

export default async function HomePage() {
  const user = await requireCurrentUser();
  const [profile, dashboard] = await Promise.all([
    getProfileForUser(user.id),
    getHomeDiveDashboard(user.id),
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
    </>
  );
}
