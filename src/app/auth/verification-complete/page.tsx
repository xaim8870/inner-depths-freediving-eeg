import Link from "next/link";
import { redirect } from "next/navigation";
import AuthShell from "@/components/auth/auth-shell";
import { getCurrentUser, getProfileForUser } from "@/lib/auth-session";

export default async function VerificationCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  if (error) {
    return (
      <AuthShell
        title="Verification link unavailable"
        description="This verification link is invalid or has expired. Request a fresh link to continue."
      >
        <Link className="auth-primary-link" href="/verify-email">Request another link</Link>
      </AuthShell>
    );
  }

  const user = await getCurrentUser();
  if (!user?.emailVerified) {
    return (
      <AuthShell
        title="Email verified"
        description="Your email is ready. Sign in to continue setting up Inner Depths."
      >
        <Link className="auth-primary-link" href="/sign-in">Continue to sign in</Link>
      </AuthShell>
    );
  }

  const profile = await getProfileForUser(user.id);
  redirect(profile ? "/app/home" : "/onboarding");
}
