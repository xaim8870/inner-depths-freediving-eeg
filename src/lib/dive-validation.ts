import { z } from "zod";
import { diveDisciplines } from "@/lib/profile-options";
import { isCompletedDateTime, isValidCalendarDate, isValidTime } from "@/lib/retrospective-session";


const requiredNumber = (schema: z.ZodNumber) =>
  z.preprocess(
    (value) => (value === "" || value === null ? undefined : Number(value)),
    schema,
  );

const optionalNumber = (schema: z.ZodNumber) =>
  z.preprocess(
    (value) => (value === "" || value === null || value === undefined ? undefined : Number(value)),
    schema.optional(),
  );

const rating = optionalNumber(z.number().int().min(1, "Choose a rating from 1 to 5.").max(5, "Choose a rating from 1 to 5."));
export const waterConditions = ["Cold", "Cool", "Warm"] as const;
export const visibilityOptions = ["Low", "Moderate", "Good"] as const;
export const currentOptions = ["None", "Some", "Strong"] as const;
export const mentalPreparationOptions = ["Relaxation", "Visualization", "Anchor cue", "Warm-up", "None"] as const;
export const notableEventOptions = ["Nothing notable", "Early turn", "Equalization issue", "Felt off", "Buddy flagged something"] as const;

export const diveFormSchema = z
  .object({
    diveDate: z
      .string()
      .refine(isValidCalendarDate, "Enter a valid dive date.")
      .refine((value) => value <= new Date().toISOString().slice(0, 10), "Dive date cannot be in the future."),
    diveTime: z.string().refine(isValidTime, "Enter a valid time."),
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
    isPersonalBest: z.boolean(),
    waterCondition: z.enum(waterConditions).optional(),
    visibility: z.enum(visibilityOptions).optional(),
    currentStrength: z.enum(currentOptions).optional(),
    equipment: z.string().trim().max(500, "Use 500 characters or fewer."),
    preDiveNerves: rating,
    calmAtDepth: rating,
    focus: rating,
    equalization: rating,
    overallFeel: rating,
    mentalPreparation: z.array(z.enum(mentalPreparationOptions)).max(5),
    notableEvent: z.enum(notableEventOptions).optional(),
    notes: z.string().trim().max(2000, "Use 2,000 characters or fewer."),
  })
  .refine((data) => data.durationMinutes * 60 + data.durationRemainderSeconds > 0, {
    message: "Dive duration must be longer than zero.",
    path: ["durationMinutes"],
  })
  .refine((data) => isCompletedDateTime(data.diveDate, data.diveTime), {
    message: "Dive date and time must be in the past.", path: ["diveTime"],
  });

export type DiveFormInput = z.infer<typeof diveFormSchema>;

export function parseDiveFormData(formData: FormData) {
  return diveFormSchema.safeParse({
    diveDate: formData.get("diveDate"),
    diveTime: formData.get("diveTime"),
    discipline: formData.get("discipline"),
    depthMeters: formData.get("depthMeters"),
    durationMinutes: formData.get("durationMinutes"),
    durationRemainderSeconds: formData.get("durationRemainderSeconds"),
    location: formData.get("location"),
    perceivedEffort: formData.get("perceivedEffort"),
    comfort: formData.get("comfort"),
    isPersonalBest: formData.get("isPersonalBest") === "on",
    waterCondition: formData.get("waterCondition") || undefined,
    visibility: formData.get("visibility") || undefined,
    currentStrength: formData.get("currentStrength") || undefined,
    equipment: formData.get("equipment"),
    preDiveNerves: formData.get("preDiveNerves"),
    calmAtDepth: formData.get("calmAtDepth"),
    focus: formData.get("focus"),
    equalization: formData.get("equalization"),
    overallFeel: formData.get("overallFeel"),
    mentalPreparation: formData.getAll("mentalPreparation"),
    notableEvent: formData.get("notableEvent") || undefined,
    notes: formData.get("notes"),
  });
}

export function toDiveValues(input: DiveFormInput) {
  return {
    diveDate: input.diveDate,
    diveTime: input.diveTime || null,
    discipline: input.discipline,
    depthMeters: input.depthMeters,
    durationSeconds: input.durationMinutes * 60 + input.durationRemainderSeconds,
    location: input.location || null,
    perceivedEffort: input.perceivedEffort,
    comfort: input.comfort,
    isPersonalBest: input.isPersonalBest,
    waterCondition: input.waterCondition ?? null,
    visibility: input.visibility ?? null,
    currentStrength: input.currentStrength ?? null,
    equipment: input.equipment || null,
    preDiveNerves: input.preDiveNerves ?? null,
    calmAtDepth: input.calmAtDepth ?? null,
    focus: input.focus ?? null,
    equalization: input.equalization ?? null,
    overallFeel: input.overallFeel ?? null,
    mentalPreparation: input.mentalPreparation.length ? input.mentalPreparation : null,
    notableEvent: input.notableEvent ?? null,
    notes: input.notes || null,
  };
}
