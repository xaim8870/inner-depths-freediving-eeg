import { startTransition } from "react";

// React 19 resets a <form action={…}> after the action finishes, which wipes every
// uncontrolled field when the server returns validation errors. Calling the action
// ourselves (inside a transition) skips that reset, so users keep what they typed.
// Keep `action={formAction}` on the form too: it still works without JavaScript.
export function keepValuesOnSubmit(formAction: (formData: FormData) => void) {
  return (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    const formData = new FormData(event.currentTarget, submitter);
    startTransition(() => formAction(formData));
  };
}
