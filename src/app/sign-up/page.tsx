import { redirect } from "next/navigation";
import AuthForm from "@/components/auth/auth-form";
import AuthShell from "@/components/auth/auth-shell";
import { getCurrentUser, getProfileForUser } from "@/lib/auth-session";

export default async function SignUpPage() {
  const user = await getCurrentUser();
  if (user?.emailVerified) {
    const profile = await getProfileForUser(user.id);
    redirect(profile ? "/app/home" : "/onboarding");
  }

  return (
    <AuthShell
      title="Begin your journey"
      description="Create your Inner Depths account to keep your dives and training together."
      footerText="Already have an account?"
      footerHref="/sign-in"
      footerLinkText="Sign in"
    >
      <AuthForm mode="sign-up" />
    </AuthShell>
  );
}
