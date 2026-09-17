import AuthShell from "@/components/auth/auth-shell";
import VerificationNavigation from "@/components/auth/verification-navigation";
import VerifyEmailForm from "@/components/auth/verify-email-form";
import { getCurrentUser } from "@/lib/auth-session";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const [user, params] = await Promise.all([getCurrentUser(), searchParams]);

  return (
    <AuthShell
      title="Check your email"
      description="Use the verification link we sent before signing in. You can request another link below."
    >
      <VerifyEmailForm initialEmail={params.email ?? user?.email ?? ""} />
      <VerificationNavigation hasSession={Boolean(user)} />
    </AuthShell>
  );
}
