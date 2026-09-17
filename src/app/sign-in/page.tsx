import { redirect } from "next/navigation";
import AuthForm from "@/components/auth/auth-form";
import AuthShell from "@/components/auth/auth-shell";
import { getCurrentUser, getProfileForUser } from "@/lib/auth-session";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ reset?: string }>;
}) {
  const user = await getCurrentUser();
  if (user?.emailVerified) {
    const profile = await getProfileForUser(user.id);
    redirect(profile ? "/app/home" : "/onboarding");
  }
  const { reset } = await searchParams;

  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to return to your Inner Depths dashboard."
      footerText="New to Inner Depths?"
      footerHref="/sign-up"
      footerLinkText="Create an account"
    >
      <AuthForm
        mode="sign-in"
        notice={reset === "success" ? "Password updated. You can now sign in." : undefined}
      />
    </AuthShell>
  );
}
