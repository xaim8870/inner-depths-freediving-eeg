import { z } from "zod";
import { diveDisciplines } from "@/lib/profile-options";

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

export const diveFormSchema = z
  .object({
    diveDate: z
      .string()
      .refine(isValidCalendarDate, "Enter a valid dive date.")
      .refine((value) => value <= new Date().toISOString().slice(0, 10), "Dive date cannot be in the future."),
    discipline: z.enum(diveDisciplines, { error: "Choose a valid discipline." }),
    depthMeters: requiredNumber(
      z.number({ error: "Enter the maximum depth." })
        .min(0, "Depth cannot be negative.")
        .max(300, "Enter a depth of 300 m or less."),
    ),
    durationMinutes: requiredNumber(
      z.number({ error: "Enter the dive minutes." })
        .int("Minutes must be a whole number.")
        .min(0, "Minutes cannot be negative.")
        .max(719, "Enter a duration under 12 hours."),
    ),
    durationRemainderSeconds: requiredNumber(
      z.number({ error: "Enter the dive seconds." })
        .int("Seconds must be a whole number.")
        .min(0, "Seconds cannot be negative.")
        .max(59, "Seconds must be between 0 and 59."),
    ),
    location: z.string().trim().max(200, "Use 200 characters or fewer."),
    perceivedEffort: requiredNumber(
      z.number({ error: "Choose perceived effort." })
        .int()
        .min(1, "Effort must be between 1 and 10.")
        .max(10, "Effort must be between 1 and 10."),
    ),
    comfort: requiredNumber(
      z.number({ error: "Choose comfort." })
        .int()
        .min(1, "Comfort must be between 1 and 5.")
        .max(5, "Comfort must be between 1 and 5."),
    ),
    notes: z.string().trim().max(2000, "Use 2,000 characters or fewer."),
  })
  .refine((data) => data.durationMinutes * 60 + data.durationRemainderSeconds > 0, {
    message: "Dive duration must be longer than zero.",
    path: ["durationMinutes"],
  });

export type DiveFormInput = z.infer<typeof diveFormSchema>;

export function parseDiveFormData(formData: FormData) {
  return diveFormSchema.safeParse({
    diveDate: formData.get("diveDate"),
    discipline: formData.get("discipline"),
    depthMeters: formData.get("depthMeters"),
    durationMinutes: formData.get("durationMinutes"),
    durationRemainderSeconds: formData.get("durationRemainderSeconds"),
    location: formData.get("location"),
    perceivedEffort: formData.get("perceivedEffort"),
    comfort: formData.get("comfort"),
    notes: formData.get("notes"),
  });
}

export function toDiveValues(input: DiveFormInput) {
  return {
    diveDate: input.diveDate,
    discipline: input.discipline,
    depthMeters: input.depthMeters,
    durationSeconds: input.durationMinutes * 60 + input.durationRemainderSeconds,
    location: input.location || null,
    perceivedEffort: input.perceivedEffort,
    comfort: input.comfort,
    notes: input.notes || null,
  };
}
