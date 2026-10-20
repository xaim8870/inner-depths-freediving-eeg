export const completedSessionCategories = ["pool", "dry_hold", "table"] as const;
export type CompletedSessionCategory = (typeof completedSessionCategories)[number];

export const completedSessionLabels: Record<CompletedSessionCategory, string> = {
  pool: "Pool",
  dry_hold: "Dry hold",
  table: "Table",
};

export const poolDisciplines = ["DYN", "DNF", "DYN-BF"] as const;
export const holdPositions = ["Sitting", "Lying", "Standing"] as const;
export const tableTypes = ["CO2", "O2"] as const;

