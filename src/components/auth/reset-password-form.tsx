"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";

const resetSchema = z.object({
  password: z.string().min(8, "Use at least 8 characters.").max(128, "Use 128 characters or fewer."),
  confirmPassword: z.string(),
}).refine((value) => value.password === value.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match.",
});

export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setFieldErrors({});
    const form = new FormData(event.currentTarget);
    const result = resetSchema.safeParse({
      password: form.get("password"),
      confirmPassword: form.get("confirmPassword"),
    });
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      setFieldErrors({ password: errors.password?.[0], confirmPassword: errors.confirmPassword?.[0] });
      return;
    }

    setPending(true);
    try {
      const response = await authClient.resetPassword({
        newPassword: result.data.password,
        token,
      });
      if (response.error) {
        setError(response.error.status === 429
          ? "Too many attempts. Please try again shortly."
          : "This reset link is invalid or has expired. Request a new one.");
        return;
      }
      router.replace("/sign-in?reset=success");
      router.refresh();
    } catch {
      setError("We could not reset your password. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor="new-password">New password</label>
      <input id="new-password" name="password" type="password" autoComplete="new-password" aria-invalid={Boolean(fieldErrors.password)} required />
      {fieldErrors.password && <p className="form-error">{fieldErrors.password}</p>}
      <label htmlFor="confirm-new-password">Confirm password</label>
      <input id="confirm-new-password" name="confirmPassword" type="password" autoComplete="new-password" aria-invalid={Boolean(fieldErrors.confirmPassword)} required />
      {fieldErrors.confirmPassword && <p className="form-error">{fieldErrors.confirmPassword}</p>}
      {error && <p className="form-error auth-general-error" role="alert">{error}</p>}
      <button type="submit" disabled={pending}>{pending ? "Updating…" : "Update password"}</button>
    </form>
  );
}
