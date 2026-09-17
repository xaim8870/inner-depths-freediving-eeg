import { z } from "zod";
import { trainingSessionTypes } from "@/lib/training-options";

const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

function isValidCalendarDate(value: string) {
  if (!isoDatePattern.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

const requiredNumber = (schema: z.ZodNumber) =>
  z.preprocess(
    (value) => (value === "" || value === null ? undefined : Number(value)),
    schema,
  );

export const trainingFormSchema = z.object({
  sessionDate: z
    .string()
    .refine(isValidCalendarDate, "Enter a valid session date.")
    .refine(
      (value) => value <= new Date().toISOString().slice(0, 10),
      "Session date cannot be in the future.",
    ),
  sessionType: z.enum(trainingSessionTypes, { error: "Choose a supported session type." }),
  durationMinutes: requiredNumber(
    z.number({ error: "Enter the session duration." })
      .int("Duration must be a whole number of minutes.")
      .min(1, "Duration must be at least 1 minute.")
      .max(720, "Enter a duration of 12 hours or less."),
  ),
  difficulty: requiredNumber(
    z.number({ error: "Choose a difficulty rating." })
      .int()
      .min(1, "Difficulty must be between 1 and 5.")
      .max(5, "Difficulty must be between 1 and 5."),
  ),
  notes: z.string().trim().max(2000, "Use 2,000 characters or fewer."),
});

export type TrainingFormInput = z.infer<typeof trainingFormSchema>;

export function parseTrainingFormData(formData: FormData) {
  return trainingFormSchema.safeParse({
    sessionDate: formData.get("sessionDate"),
    sessionType: formData.get("sessionType"),
    durationMinutes: formData.get("durationMinutes"),
    difficulty: formData.get("difficulty"),
    notes: formData.get("notes"),
  });
}

export function toTrainingSessionValues(input: TrainingFormInput) {
  return {
    sessionDate: input.sessionDate,
    sessionType: input.sessionType,
    durationMinutes: input.durationMinutes,
    difficulty: input.difficulty,
    notes: input.notes || null,
  };
}
