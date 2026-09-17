"use client";

import { useState, type FormEvent } from "react";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";

const emailSchema = z.string().trim().toLowerCase().email("Enter a valid email address.");

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Enter a valid email address.");
      return;
    }

    setPending(true);
    try {
      const response = await authClient.requestPasswordReset({
        email: result.data,
        redirectTo: "/reset-password",
      });
      if (response.error?.status === 429) {
        setError("Too many attempts. Please try again shortly.");
        return;
      }
      setSent(true);
    } catch {
      setError("We could not connect right now. Please try again.");
    } finally {
      setPending(false);
    }
  }

  if (sent) {
    return (
      <div className="auth-state" role="status">
        <strong>Check your email</strong>
        <p>If an account exists for that email, a password reset link has been sent.</p>
      </div>
    );
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor="reset-email">Email</label>
      <input
        id="reset-email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        autoComplete="email"
        aria-invalid={Boolean(error)}
        required
      />
      {error && <p className="form-error" role="alert">{error}</p>}
      <button type="submit" disabled={pending}>{pending ? "Sending…" : "Send reset link"}</button>
    </form>
  );
}
