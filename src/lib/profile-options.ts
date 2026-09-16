export const experienceLevels = ["beginner", "intermediate", "advanced"] as const;

export const diveDisciplines = [
  "constant_weight",
  "free_immersion",
  "no_fins",
  "dynamic",
  "static",
  "fun_dive",
] as const;

export const disciplineLabels: Record<(typeof diveDisciplines)[number], string> = {
  constant_weight: "Constant weight",
  free_immersion: "Free immersion",
  no_fins: "No fins",
  dynamic: "Dynamic",
  static: "Static",
  fun_dive: "Fun dive",
};
