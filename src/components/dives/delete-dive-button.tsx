"use client";

import { useActionState } from "react";

type DeleteState = { error?: string };

export default function DeleteDiveButton({
  action,
}: {
  action: (state: DeleteState, formData: FormData) => Promise<DeleteState>;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!window.confirm("Delete this dive permanently?")) event.preventDefault();
      }}
      className="delete-dive-form"
    >
      <button type="submit" disabled={pending} className="delete-dive-button">
        {pending ? "Deleting…" : "Delete dive"}
      </button>
      {state.error ? <p className="form-error" role="alert">{state.error}</p> : null}
    </form>
  );
}
