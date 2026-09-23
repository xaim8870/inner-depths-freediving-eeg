"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";

import { authClient } from "@/lib/auth-client";

const signInSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

const signUpSchema = signInSchema
  .extend({
    password: z
      .string()
      .min(8, "Use at least 8 characters.")
      .max(128, "Use 128 characters or fewer."),
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
}: {
  mode: "sign-in" | "sign-up";
}) {
  const router = useRouter();

  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isSignUp = mode === "sign-up";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setFieldErrors({});

    const form = new FormData(event.currentTarget);

    const input = {
      email: form.get("email"),
      password: form.get("password"),
      confirmPassword: form.get("confirmPassword"),
    };

    const result = isSignUp
      ? signUpSchema.safeParse(input)
      : signInSchema.safeParse(input);

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
          })
        : await authClient.signIn.email({
            email: result.data.email,
            password: result.data.password,
          });

      if (response.error) {
        if (response.error.status === 429) {
          setError("Too many attempts. Please try again shortly.");
        } else {
          setError(
            response.error.message ||
              "Authentication failed. Please try again.",
          );
        }

        return;
      }

      router.replace(isSignUp ? "/onboarding" : "/app/home");
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

      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        required
        aria-invalid={Boolean(fieldErrors.email)}
      />

      {fieldErrors.email?.[0] && (
        <p className="form-error">{fieldErrors.email[0]}</p>
      )}

      <label htmlFor="password">Password</label>

      <div className="password-field">
        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete={isSignUp ? "new-password" : "current-password"}
          required
          aria-invalid={Boolean(fieldErrors.password)}
        />

        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword((current) => !current)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          aria-pressed={showPassword}
        >
          {showPassword ? (
            <EyeOff size={20} aria-hidden="true" />
          ) : (
            <Eye size={20} aria-hidden="true" />
          )}
        </button>
      </div>

      {fieldErrors.password?.[0] && (
        <p className="form-error">{fieldErrors.password[0]}</p>
      )}

      {isSignUp && (
        <>
          <label htmlFor="confirmPassword">Confirm password</label>

          <div className="password-field">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              aria-invalid={Boolean(fieldErrors.confirmPassword)}
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowConfirmPassword((current) => !current)
              }
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
              aria-pressed={showConfirmPassword}
            >
              {showConfirmPassword ? (
                <EyeOff size={20} aria-hidden="true" />
              ) : (
                <Eye size={20} aria-hidden="true" />
              )}
            </button>
          </div>

          {fieldErrors.confirmPassword?.[0] && (
            <p className="form-error">
              {fieldErrors.confirmPassword[0]}
            </p>
          )}
        </>
      )}

      {error && (
        <p className="form-error auth-general-error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" disabled={pending}>
        {pending
          ? "Please wait…"
          : isSignUp
            ? "Create account"
            : "Sign in"}
      </button>
    </form>
  );
}