import { redirect } from "next/navigation";

import AuthForm from "@/components/auth/auth-form";
import AuthShell from "@/components/auth/auth-shell";
import { getCurrentUser, getProfileForUser } from "@/lib/auth-session";

export default async function SignInPage() {
  const user = await getCurrentUser();

  if (user) {
    const profile = await getProfileForUser(user.id);
    redirect(profile ? "/app/home" : "/onboarding");
  }

  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to return to your Inner Depths dashboard."
      footerText="Don't have an account?"
      footerHref="/sign-up"
      footerLinkText="Sign up"
    >
      <AuthForm mode="sign-in" />
    </AuthShell>
  );
}