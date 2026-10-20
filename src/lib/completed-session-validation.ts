import { z } from "zod";
import {
  completedSessionCategories,
  holdPositions,
  poolDisciplines,
  tableTypes,
} from "./completed-session-options.ts";
import { isCompletedDateTime, isValidCalendarDate, isValidTime } from "./retrospective-session.ts";

const optionalNumber = (schema: z.ZodNumber) => z.preprocess(
  (value) => value === "" || value === null || value === undefined ? undefined : Number(value),
  schema.optional(),
);
const rating = optionalNumber(z.number().int().min(1).max(5));

export const completedSessionSchema = z.object({
  sessionCategory: z.enum(completedSessionCategories),
  sessionDate: z.string()
    .refine(isValidCalendarDate, "Enter a valid date."),
  sessionTime: z.string().refine(isValidTime, "Enter a valid time."),
  durationMinutes: z.preprocess((value) => Number(value), z.number().int().min(1, "Enter at least 1 minute.").max(720, "Enter 12 hours or less.")),
  poolDiscipline: z.enum(poolDisciplines).optional(),
  distanceMeters: optionalNumber(z.number().positive("Enter a positive distance.").max(5000, "Enter 5,000 m or less.")),
  poolLengthMeters: optionalNumber(z.number().int().refine((value) => value === 25 || value === 50, "Choose 25 m or 50 m.")),
  sessionEffort: rating,
  bestHoldSeconds: optionalNumber(z.number().int().min(1).max(3600)),
  holdCount: optionalNumber(z.number().int().min(1).max(100)),
  holdPosition: z.enum(holdPositions).optional(),
  urgeToBreathe: rating,
  tableType: z.enum(tableTypes).optional(),
  tableRounds: optionalNumber(z.number().int().min(1).max(50)),
  completedRounds: optionalNumber(z.number().int().min(0).max(50)),
  holdSeconds: optionalNumber(z.number().int().min(1).max(3600)),
  restSeconds: optionalNumber(z.number().int().min(0).max(3600)),
  preSessionNerves: rating,
  calmRating: rating,
  focusRating: rating,
  overallFeel: rating,
  notes: z.string().trim().max(2000, "Use 2,000 characters or fewer."),
  supervisionAttested: z.literal(true, { error: "Confirm that this completed session was supervised." }),
}).superRefine((data, context) => {
  if (!isCompletedDateTime(data.sessionDate, data.sessionTime)) context.addIssue({ code: "custom", path: ["sessionTime"], message: "Session date and time must be in the past." });
  const requireField = (field: keyof typeof data, message: string) => {
    if (data[field] === undefined) context.addIssue({ code: "custom", path: [field], message });
  };
  if (data.sessionCategory === "pool") {
    requireField("poolDiscipline", "Choose a pool discipline.");
    requireField("distanceMeters", "Enter the completed distance.");
    requireField("poolLengthMeters", "Choose the pool length.");
    requireField("sessionEffort", "Rate the session effort.");
  }
  if (data.sessionCategory === "dry_hold") {
    requireField("bestHoldSeconds", "Enter the best completed hold.");
    requireField("holdCount", "Enter the number of holds.");
    requireField("holdPosition", "Choose the hold position.");
    requireField("urgeToBreathe", "Rate the urge to breathe.");
  }
  if (data.sessionCategory === "table") {
    requireField("tableType", "Choose the completed table type.");
    requireField("tableRounds", "Enter the number of rounds in the table.");
    requireField("completedRounds", "Enter completed rounds.");
    requireField("holdSeconds", "Enter the recorded hold per round.");
    requireField("restSeconds", "Enter the recorded rest per round.");
    if (data.tableRounds !== undefined && data.completedRounds !== undefined && data.completedRounds > data.tableRounds) {
      context.addIssue({ code: "custom", path: ["completedRounds"], message: "Completed rounds cannot exceed table rounds." });
    }
  }
});

export type CompletedSessionInput = z.infer<typeof completedSessionSchema>;

export function parseCompletedSessionFormData(formData: FormData) {
  const value = (name: string) => formData.get(name) || undefined;
  return completedSessionSchema.safeParse({
    sessionCategory: value("sessionCategory"), sessionDate: formData.get("sessionDate"),
    sessionTime: formData.get("sessionTime"), durationMinutes: formData.get("durationMinutes"),
    poolDiscipline: value("poolDiscipline"), distanceMeters: value("distanceMeters"),
    poolLengthMeters: value("poolLengthMeters"), sessionEffort: value("sessionEffort"),
    bestHoldSeconds: value("bestHoldSeconds"), holdCount: value("holdCount"),
    holdPosition: value("holdPosition"), urgeToBreathe: value("urgeToBreathe"),
    tableType: value("tableType"), tableRounds: value("tableRounds"),
    completedRounds: value("completedRounds"), holdSeconds: value("holdSeconds"), restSeconds: value("restSeconds"),
    preSessionNerves: value("preSessionNerves"), calmRating: value("calmRating"),
    focusRating: value("focusRating"), overallFeel: value("overallFeel"), notes: formData.get("notes"),
    supervisionAttested: formData.get("supervisionAttested") === "on",
  });
}

export function toCompletedSessionValues(input: CompletedSessionInput) {
  const labels = input.sessionCategory === "pool" ? input.poolDiscipline : input.sessionCategory === "dry_hold" ? "Dry hold" : `${input.tableType} Table`;
  return {
    sessionDate: input.sessionDate, sessionTime: input.sessionTime || null,
    sessionType: labels ?? "Completed session", sessionCategory: input.sessionCategory,
    durationMinutes: input.durationMinutes, difficulty: input.sessionEffort ?? input.urgeToBreathe ?? null,
    poolDiscipline: input.poolDiscipline ?? null, distanceMeters: input.distanceMeters ?? null,
    poolLengthMeters: input.poolLengthMeters ?? null, sessionEffort: input.sessionEffort ?? null,
    bestHoldSeconds: input.bestHoldSeconds ?? null, holdCount: input.holdCount ?? null,
    holdPosition: input.holdPosition ?? null, urgeToBreathe: input.urgeToBreathe ?? null,
    tableType: input.tableType ?? null, tableRounds: input.tableRounds ?? null,
    completedRounds: input.completedRounds ?? null, holdSeconds: input.holdSeconds ?? null,
    restSeconds: input.restSeconds ?? null, preSessionNerves: input.preSessionNerves ?? null,
    calmRating: input.calmRating ?? null, focusRating: input.focusRating ?? null,
    overallFeel: input.overallFeel ?? null, notes: input.notes || null, supervisionAttested: true,
  };
}
