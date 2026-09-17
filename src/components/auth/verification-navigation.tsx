"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

type Destination = "/sign-in" | "/sign-up";

export default function VerificationNavigation({ hasSession }: { hasSession: boolean }) {
  const router = useRouter();
  const [pending, setPending] = useState<Destination | null>(null);
  const [error, setError] = useState("");

  async function leaveVerification(destination: Destination) {
    setPending(destination);
    setError("");

    try {
      if (hasSession) {
        const response = await authClient.signOut();
        if (response.error) {
          setError("Could not switch accounts. Please try again.");
          return;
        }
      }
      router.replace(destination);
      router.refresh();
    } catch {
      setError("Could not switch accounts. Please try again.");
    } finally {
      setPending(null);
    }
  }

  if (!hasSession) {
    return (
      <div className="verification-navigation">
        <p>Want to use another account? <Link href="/sign-in">Sign in</Link></p>
        <p>Need a different email? <Link href="/sign-up">Create an account</Link></p>
      </div>
    );
  }

  return (
    <div className="verification-navigation">
      <p>
        Want to use another account?{" "}
        <button type="button" onClick={() => leaveVerification("/sign-in")} disabled={pending !== null}>
          {pending === "/sign-in" ? "Signing out…" : "Sign in"}
        </button>
      </p>
      <p>
        Need a different email?{" "}
        <button type="button" onClick={() => leaveVerification("/sign-up")} disabled={pending !== null}>
          {pending === "/sign-up" ? "Signing out…" : "Create an account"}
        </button>
      </p>
      {error && <p className="form-error" role="alert">{error}</p>}
    </div>
  );
}
