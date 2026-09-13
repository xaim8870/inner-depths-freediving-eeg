import HomeHeader from "@/components/home/home-header";
import HomeIntro from "@/components/home/home-intro";
import MorningBiometrics from "@/components/home/morning-biometrics";
import CycleSummary from "@/components/home/cycle-summary";
import TrainingInsight from "@/components/home/training-insight";
import PerformanceProgress from "@/components/home/performance-progress";

export default function HomePage() {
  return (
    <>
      <HomeHeader />
      <HomeIntro />
      <MorningBiometrics />
      <CycleSummary />
      <TrainingInsight />
      <PerformanceProgress />
    </>
  );
}
