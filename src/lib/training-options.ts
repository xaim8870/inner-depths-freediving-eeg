export const trainingSessionTypes = [
  "CO2 Table",
  "O2 Table",
  "Static Apnea",
  "Dynamic Apnea",
  "Pool Training",
  "Depth Training",
  "Dry Training",
  "Mobility",
  "Breathwork",
  "Other",
] as const;

export type TrainingSessionType = (typeof trainingSessionTypes)[number];
