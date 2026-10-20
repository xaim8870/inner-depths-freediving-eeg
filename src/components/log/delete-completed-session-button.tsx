"use client";
import { useActionState } from "react";

export default function DeleteCompletedSessionButton({ action }: { action: (state: { error?: string }, formData: FormData) => Promise<{ error?: string }> }) {
  const [state, formAction, pending] = useActionState(action, {});
  return <form action={formAction} onSubmit={(event) => { if (!window.confirm("Delete this completed session permanently?")) event.preventDefault(); }}>
    <button type="submit" disabled={pending} className="delete-dive-button">{pending ? "Deleting…" : "Delete session"}</button>
    {state.error ? <p className="form-error" role="alert">{state.error}</p> : null}
  </form>;
}
