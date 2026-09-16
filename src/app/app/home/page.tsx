import HomeHeader from "@/components/home/home-header";
import HomeIntro from "@/components/home/home-intro";
import MorningBiometrics from "@/components/home/morning-biometrics";
import CycleSummary from "@/components/home/cycle-summary";
import TrainingInsight from "@/components/home/training-insight";
import PerformanceProgress from "@/components/home/performance-progress";
import { getProfileForUser, requireCurrentUser } from "@/lib/auth-session";

export default async function HomePage() {
  const user = await requireCurrentUser();
  const profile = await getProfileForUser(user.id);

  return (
    <>
      <HomeHeader />
      <HomeIntro displayName={profile?.displayName ?? user.name} />
      <MorningBiometrics />
      <CycleSummary />
      <TrainingInsight />
      <PerformanceProgress />
    </>
  );
}
