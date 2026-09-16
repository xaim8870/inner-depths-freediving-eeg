"use client";

import { useActionState } from "react";
import { saveProfile, type OnboardingState } from "@/app/onboarding/actions";
import { disciplineLabels, diveDisciplines, experienceLevels } from "@/lib/profile-options";

const initialState: OnboardingState = { error: "", fieldErrors: {} };

export default function OnboardingForm() {
  const [state, action, pending] = useActionState(saveProfile, initialState);

  return (
    <form className="auth-form" action={action} noValidate>
      <label htmlFor="displayName">Display name</label>
      <input id="displayName" name="displayName" type="text" autoComplete="nickname" maxLength={100} required aria-invalid={Boolean(state.fieldErrors.displayName)} />
      {state.fieldErrors.displayName && <p className="form-error">{state.fieldErrors.displayName}</p>}

      <label htmlFor="experienceLevel">Experience level</label>
      <select id="experienceLevel" name="experienceLevel" defaultValue="" required aria-invalid={Boolean(state.fieldErrors.experienceLevel)}>
        <option value="" disabled>Choose your level</option>
        {experienceLevels.map((level) => (
          <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
        ))}
      </select>
      {state.fieldErrors.experienceLevel && <p className="form-error">{state.fieldErrors.experienceLevel}</p>}

      <label htmlFor="primaryDiscipline">Primary discipline</label>
      <select id="primaryDiscipline" name="primaryDiscipline" defaultValue="" required aria-invalid={Boolean(state.fieldErrors.primaryDiscipline)}>
        <option value="" disabled>Choose a discipline</option>
        {diveDisciplines.map((discipline) => (
          <option key={discipline} value={discipline}>{disciplineLabels[discipline]}</option>
        ))}
      </select>
      {state.fieldErrors.primaryDiscipline && <p className="form-error">{state.fieldErrors.primaryDiscipline}</p>}

      {state.error && <p className="form-error auth-general-error" role="alert">{state.error}</p>}
      <button type="submit" disabled={pending}>{pending ? "Saving…" : "Continue to Home"}</button>
    </form>
  );
}
