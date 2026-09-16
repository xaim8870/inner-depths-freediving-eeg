import { redirect } from "next/navigation";
import AuthShell from "@/components/auth/auth-shell";
import OnboardingForm from "@/components/auth/onboarding-form";
import SignOutButton from "@/components/auth/sign-out-button";
import { getProfileForUser, requireCurrentUser } from "@/lib/auth-session";

export default async function OnboardingPage() {
  const user = await requireCurrentUser();
  const profile = await getProfileForUser(user.id);
  if (profile) redirect("/app/home");

  return (
    <AuthShell
      title="Your diving profile"
      description="A few details help make Inner Depths feel like yours."
    >
      <OnboardingForm />
      <div className="onboarding-sign-out"><SignOutButton /></div>
    </AuthShell>
  );
}
