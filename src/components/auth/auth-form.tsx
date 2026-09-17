"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";

const signInSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

const signUpSchema = signInSchema
  .extend({
    password: z.string().min(8, "Use at least 8 characters.").max(128, "Use 128 characters or fewer."),
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

type FieldErrors = {
  email?: string[];
  password?: string[];
  confirmPassword?: string[];
};

export default function AuthForm({
  mode,
  notice,
}: {
  mode: "sign-in" | "sign-up";
  notice?: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const isSignUp = mode === "sign-up";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setFieldErrors({});
    setUnverifiedEmail("");

    const form = new FormData(event.currentTarget);
    const input = {
      email: form.get("email"),
      password: form.get("password"),
      confirmPassword: form.get("confirmPassword"),
    };
    const result = isSignUp ? signUpSchema.safeParse(input) : signInSchema.safeParse(input);
    if (!result.success) {
      setFieldErrors(result.error.flatten().fieldErrors);
      return;
    }

    setPending(true);
    try {
      const response = isSignUp
        ? await authClient.signUp.email({
            email: result.data.email,
            password: result.data.password,
            name: "Diver",
            callbackURL: "/auth/verification-complete",
          })
        : await authClient.signIn.email({
            email: result.data.email,
            password: result.data.password,
          });

      if (response.error) {
        if (response.error.status === 429) {
          setError("Too many attempts. Please try again shortly.");
        } else if (response.error.code === "EMAIL_NOT_VERIFIED") {
          setError("Please verify your email before signing in.");
          setUnverifiedEmail(result.data.email);
        } else {
          setError(response.error.message || "Authentication failed. Please try again.");
        }
        return;
      }

      router.replace(isSignUp
        ? `/verify-email?email=${encodeURIComponent(result.data.email)}`
        : "/app/home");
      router.refresh();
    } catch {
      setError("We could not connect right now. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" autoComplete="email" required aria-invalid={Boolean(fieldErrors.email)} />
      {fieldErrors.email?.[0] && <p className="form-error">{fieldErrors.email[0]}</p>}

      <label htmlFor="password">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete={isSignUp ? "new-password" : "current-password"}
        required
        aria-invalid={Boolean(fieldErrors.password)}
      />
      {fieldErrors.password?.[0] && <p className="form-error">{fieldErrors.password[0]}</p>}

      {isSignUp && (
        <>
          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            aria-invalid={Boolean(fieldErrors.confirmPassword)}
          />
          {fieldErrors.confirmPassword?.[0] && (
            <p className="form-error">{fieldErrors.confirmPassword[0]}</p>
          )}
        </>
      )}

      {notice && !error && <p className="auth-notice" role="status">{notice}</p>}
      {error && <p className="form-error auth-general-error" role="alert">{error}</p>}
      {unverifiedEmail && (
        <Link className="auth-inline-link" href={`/verify-email?email=${encodeURIComponent(unverifiedEmail)}`}>
          Resend verification email
        </Link>
      )}
      {!isSignUp && <Link className="auth-inline-link auth-forgot-link" href="/forgot-password">Forgot password?</Link>}
      <button type="submit" disabled={pending}>
        {pending ? "Please wait…" : isSignUp ? "Create account" : "Sign in"}
      </button>
    </form>
  );
}
