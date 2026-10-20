import { notFound } from "next/navigation";
import AssessmentFlow from "@/components/performance-profile/assessment-flow";
import ProfileResult from "@/components/performance-profile/profile-result";
import { getLatestPerformanceAssessment, getOwnedPerformanceAssessment } from "@/db/performance-assessments";
import { getProfileForUser, requireCurrentUser } from "@/lib/auth-session";

export default async function PerformanceProfilePage({ searchParams }: { searchParams: Promise<{ retake?: string; completed?: string }> }) {
  const user = await requireCurrentUser();
  const params = await searchParams;
  if (params.retake === "1") {
    const profile = await getProfileForUser(user.id);
    return <AssessmentFlow firstName={(profile?.displayName ?? user.name ?? "Diver").split(" ")[0]} />;
  }
  const assessment = params.completed
    ? await getOwnedPerformanceAssessment(user.id, params.completed)
    : await getLatestPerformanceAssessment(user.id);
  if (params.completed && !assessment) notFound();
  if (assessment) return <ProfileResult result={assessment.result} completedAt={assessment.completedAt} />;
  const profile = await getProfileForUser(user.id);
  return <AssessmentFlow firstName={(profile?.displayName ?? user.name ?? "Diver").split(" ")[0]} />;
}
