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
     
    >
      <button type="submit" disabled={pending} className="ui-btn ui-btn-danger ui-btn-sm">
        {pending ? "Deleting…" : "Delete dive"}
      </button>
      {state.error ? <p className="ui-error" role="alert">{state.error}</p> : null}
    </form>
  );
}
