"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { requireCurrentUser } from "@/lib/auth-session";
import { diveDisciplines, experienceLevels } from "@/lib/profile-options";

const profileSchema = z.object({
  displayName: z.string().trim().min(2, "Enter at least 2 characters.").max(100, "Use 100 characters or fewer."),
  experienceLevel: z.enum(experienceLevels),
  primaryDiscipline: z.enum(diveDisciplines),
});

export type OnboardingState = {
  error: string;
  fieldErrors: {
    displayName?: string;
    experienceLevel?: string;
    primaryDiscipline?: string;
  };
};

export async function saveProfile(
  _previousState: OnboardingState,
  formData: FormData,
): Promise<OnboardingState> {
  const user = await requireCurrentUser();
  const result = profileSchema.safeParse({
    displayName: formData.get("displayName"),
    experienceLevel: formData.get("experienceLevel"),
    primaryDiscipline: formData.get("primaryDiscipline"),
  });

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return {
      error: "Please check the highlighted fields.",
      fieldErrors: {
        displayName: errors.displayName?.[0],
        experienceLevel: errors.experienceLevel?.[0],
        primaryDiscipline: errors.primaryDiscipline?.[0],
      },
    };
  }

  try {
    // userId always comes from the validated session, never the form.
    await db
      .insert(profiles)
      .values({ userId: user.id, ...result.data })
      .onConflictDoNothing({ target: profiles.userId });
  } catch {
    return {
      error: "We could not save your profile. Please try again.",
      fieldErrors: {},
    };
  }

  redirect("/app/home");
}
