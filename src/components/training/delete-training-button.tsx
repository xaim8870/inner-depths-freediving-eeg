"use client";

import { useActionState } from "react";

type DeleteState = { error?: string };

export default function DeleteTrainingButton({
  action,
}: {
  action: (state: DeleteState, formData: FormData) => Promise<DeleteState>;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!window.confirm("Delete this training session permanently?")) event.preventDefault();
      }}
      className="delete-training-form"
    >
      <button type="submit" disabled={pending} className="delete-training-button">
        {pending ? "Deleting…" : "Delete session"}
      </button>
      {state.error ? <p className="form-error" role="alert">{state.error}</p> : null}
    </form>
  );
}
