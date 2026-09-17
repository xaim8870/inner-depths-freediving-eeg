import Link from "next/link";
import AuthShell from "@/components/auth/auth-shell";
import ResetPasswordForm from "@/components/auth/reset-password-form";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const { token, error } = await searchParams;
  const invalid = error === "INVALID_TOKEN" || !token;

  return (
    <AuthShell
      title={invalid ? "Reset link unavailable" : "Choose a new password"}
      description={invalid
        ? "This password reset link is invalid or has expired."
        : "Use a unique password with at least eight characters."}
      footerHref="/sign-in"
      footerLinkText="Return to sign in"
    >
      {invalid ? (
        <Link className="auth-primary-link" href="/forgot-password">Request another reset link</Link>
      ) : (
        <ResetPasswordForm token={token} />
      )}
    </AuthShell>
  );
}
