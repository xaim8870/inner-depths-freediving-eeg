"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function handleSignOut() {
    setPending(true);
    setError("");
    try {
      const response = await authClient.signOut();
      if (response.error) {
        setError("Could not sign out. Please try again.");
        return;
      }
      router.replace("/sign-in");
      router.refresh();
    } catch {
      setError("Could not sign out. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <button type="button" className="sign-out-button" onClick={handleSignOut} disabled={pending}>
        {pending ? "Signing out…" : "Sign out"}
      </button>
      {error && <p className="form-error" role="alert">{error}</p>}
    </>
  );
}
