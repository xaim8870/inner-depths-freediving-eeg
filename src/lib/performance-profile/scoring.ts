import {
  assessmentGoals,
  assessmentItems,
  PERFORMANCE_PROFILE_VERSION,
  styleItems,
  type AssessmentGoalId,
  type AssessmentResponses,
} from "./definitions.ts";

const BLEND_MARGIN = 12;
const n01 = (value: number) => (value - 1) / 4;

export type PathwayId = "regulation" | "attentional_control" | "confidence_flow";
export type ConstructScores = Record<
  | "somatic" | "worry" | "concentration" | "debilitative" | "reinvestment"
  | "efficacy" | "sensation" | "promotion" | "prevention" | "monitoring"
  | "negativeSelfTalk" | "flow" | "masteryApproach" | "performanceAvoidance"
  | "blunting" | "instructionalSelfTalk" | "avoidance",
  number
>;

const pathwayDefinitions = [
  {
    id: "regulation" as const,
    label: "Arousal & worry regulation",
    colour: "#46B3A9",
    lead: "Managing physical activation and pre-dive worry is where your profile points most strongly — one of the best-evidenced areas to train.",
    score: (c: ConstructScores) => .30 * n01(c.somatic) + .30 * n01(c.worry) + .25 * n01(c.debilitative) + .15 * (1 - n01(c.efficacy)),
    factors: [
      { key: "somatic" as const, weight: .30, label: "how much your body tenses up" },
      { key: "worry" as const, weight: .30, label: "pre-dive worry" },
      { key: "debilitative" as const, weight: .25, label: "reading nerves as a bad sign" },
      { key: "efficacy" as const, weight: .15, invert: true, label: "less trust in staying in control" },
    ],
  },
  {
    id: "attentional_control" as const,
    label: "Attentional control & automaticity",
    colour: "#2E7D97",
    lead: "Keeping attention where it belongs — and letting well-trained skills run themselves rather than over-controlling them — is where your profile points most strongly.",
    score: (c: ConstructScores) => .55 * n01(c.reinvestment) + .30 * n01(c.concentration) + .15 * (1 - n01(c.worry)),
    factors: [
      { key: "reinvestment" as const, weight: .55, label: "over-controlling movements you already own" },
      { key: "concentration" as const, weight: .30, label: "attention drifting under pressure" },
      { key: "worry" as const, weight: .15, invert: true, label: "relatively low worry" },
    ],
  },
  {
    id: "confidence_flow" as const,
    label: "Confidence & flow",
    colour: "#3E8FA6",
    provisional: true,
    lead: "Building durable self-belief — and getting out of your own way so absorbed focus can happen — is where your profile points most strongly.",
    score: (c: ConstructScores) => .50 * (1 - n01(c.efficacy)) + .30 * (1 - n01(c.flow)) + .20 * n01(c.negativeSelfTalk),
    factors: [
      { key: "efficacy" as const, weight: .50, invert: true, label: "less trust in your own capability" },
      { key: "flow" as const, weight: .30, invert: true, label: "harder to drop into absorbed, self-forgetting focus" },
      { key: "negativeSelfTalk" as const, weight: .20, label: "the inner critic speaking up" },
    ],
  },
] as const;

const styleDefinitions = {
  ext: { title: "Where your energy comes from", low: "Recharges in quiet", high: "Recharges around people", lowStrength: "You’re at home in the calm, inward, solitary side of freediving — a real asset in a sport that rewards stillness.", highStrength: "You draw energy from training partners and the shared stoke of a dive community.", middleStrength: "You flex between quiet focus and shared energy — use whichever a session needs.", lowSkill: "Solo dry practice will feel natural; dip into the community on your own terms.", highSkill: "Lean on buddy sessions and the Cove — connection will keep you consistent." },
  con: { title: "How you like to work", low: "Flexible & spontaneous", high: "Structured & methodical", lowStrength: "You adapt easily and train by feel — great for rolling with conditions and staying unforced.", highStrength: "Planning and follow-through come naturally — consistency like this is one of the strongest drivers of steady progress.", middleStrength: "You mix planning with going by feel, and can lean either way.", lowSkill: "One small fixed routine (a short pre-dive sequence) makes your adaptability even more reliable — and it’s quickly learned.", highSkill: "An occasional ‘train by feel’ day keeps your structure from turning rigid." },
  opn: { title: "How you approach the new", low: "Prefers the proven", high: "Curious & experimental", lowStrength: "You build deep mastery by refining what works — reliability is a genuine strength.", highStrength: "You try new drills readily — curiosity like this tends to speed up learning.", middleStrength: "You balance the proven with the new.", lowSkill: "Sampling one new drill now and then, at your own pace, can unlock a plateau.", highSkill: "Anchoring your experiments around one repeatable core drill keeps gains consistent." },
  agr: { title: "How you team up", low: "Independent & candid", high: "Cooperative", lowStrength: "You’re self-reliant and straight-talking — handy for holding your own line and speaking up on safety.", highStrength: "You invest in getting along — exactly what builds the trust freediving safety depends on.", middleStrength: "You cooperate while keeping your own line.", lowSkill: "You can still build deep buddy trust that keeps diving safe — on your own terms.", highSkill: "Buddy features and shared plans will suit you well." },
  emo: { title: "How you experience feeling", low: "Even-keel", high: "Strongly feeling", lowStrength: "You stay steady when things get intense — a calm platform to build precision on.", highStrength: "You feel body sensations and emotions vividly — that rich body-awareness is exactly the signal freedivers learn to work with.", middleStrength: "You feel things clearly but aren’t easily thrown.", lowSkill: "Sharpening subtle body-awareness on top of that steadiness adds fine control.", highSkill: "Your plan’s regulation skills turn strong signal into steady control — a learnable skill, not a fixed trait." },
} as const;

export function calculateConstructScores(responses: AssessmentResponses): ConstructScores {
  const grouped = new Map<string, number[]>();
  for (const item of assessmentItems) {
    const raw = responses[item.id];
    if (raw === undefined) continue;
    const value = "reverse" in item && item.reverse ? 6 - raw : raw;
    const key = `${item.construct}:${item.subscale}`;
    grouped.set(key, [...(grouped.get(key) ?? []), value]);
  }
  const get = (key: string) => {
    const values = grouped.get(key);
    return values?.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 3;
  };
  return {
    somatic: get("anxiety:somatic"), worry: get("anxiety:worry"), concentration: get("anxiety:concentration"),
    debilitative: get("direction:interpretation"),
    reinvestment: (get("reinvestment:conscious_motor_processing") + get("reinvestment:movement_self_consciousness") + get("reinvestment:decision_reinvestment")) / 3,
    efficacy: get("self_efficacy:confidence"), sensation: get("sensation:seeking"), promotion: get("regulatory:promotion"),
    prevention: get("regulatory:prevention"), monitoring: get("coping:monitoring"), negativeSelfTalk: get("selftalk:negative"),
    flow: get("flow:disposition"), masteryApproach: get("achievement:mastery_approach"), performanceAvoidance: get("achievement:performance_avoidance"),
    blunting: get("coping:blunting"), instructionalSelfTalk: get("selftalk:instructional"), avoidance: get("avoidance:behavioral"),
  };
}

function scoreStyle(responses: AssessmentResponses) {
  const grouped = new Map<string, number[]>();
  for (const item of styleItems) {
    const raw = responses[item.id];
    if (raw === undefined) continue;
    const value = "reverse" in item && item.reverse ? 6 - raw : raw;
    grouped.set(item.dimension, [...(grouped.get(item.dimension) ?? []), value]);
  }
  return (Object.keys(styleDefinitions) as Array<keyof typeof styleDefinitions>).map((dimension) => {
    const values = grouped.get(dimension) ?? [3];
    const value = values.reduce((sum, item) => sum + item, 0) / values.length;
    const side = value >= 3.4 ? "high" : value <= 2.6 ? "low" : "middle";
    const definition = styleDefinitions[dimension];
    return {
      dimension, title: definition.title, low: definition.low, high: definition.high,
      position: Math.round(((value - 1) / 4) * 100), side,
      strength: side === "high" ? definition.highStrength : side === "low" ? definition.lowStrength : definition.middleStrength,
      skill: side === "high" ? definition.highSkill : side === "low" ? definition.lowSkill : "",
    };
  });
}

function route(c: ConstructScores) {
  const ranked = pathwayDefinitions.map((definition) => ({
    id: definition.id, label: definition.label, colour: definition.colour, lead: definition.lead,
    provisional: "provisional" in definition && definition.provisional,
    raw: Math.max(0, definition.score(c)), pct: 0,
  }));
  const total = ranked.reduce((sum, item) => sum + item.raw, 0) || 1;
  ranked.forEach((item) => { item.pct = Math.round((item.raw / total) * 100); });
  ranked[0].pct += 100 - ranked.reduce((sum, item) => sum + item.pct, 0);
  ranked.sort((a, b) => b.raw - a.raw);
  return { ranked, dominant: ranked[0], blend: ranked.length > 1 && Math.abs(ranked[0].pct - ranked[1].pct) <= BLEND_MARGIN };
}

function explain(c: ConstructScores, pathwayId: PathwayId) {
  const definition = pathwayDefinitions.find((item) => item.id === pathwayId)!;
  return definition.factors.map((factor) => ({
    label: factor.label,
    value: c[factor.key],
    contribution: factor.weight * ("invert" in factor && factor.invert ? 1 - n01(c[factor.key]) : n01(c[factor.key])),
  })).sort((a, b) => b.contribution - a.contribution);
}

function modifiers(c: ConstructScores) {
  const result: Array<{ tag: string; text: string }> = [];
  if (c.negativeSelfTalk >= 3.5) result.push({ tag: "Self-talk", text: "Frequent negative self-talk — layer in reframing and a prepared cue script." });
  if (c.instructionalSelfTalk <= 2.5) result.push({ tag: "Self-talk", text: "You make little use of instructional cue-words — building a short prepared cue script (“relax shoulders”, “slow exhale”) is a quick, well-evidenced gain." });
  if (c.monitoring >= 3.5 && c.blunting <= 2.5) result.push({ tag: "Coping style", text: "You lean toward monitoring (wanting internal detail). Surface the sensations rather than hiding them — but pair with tolerance framing." });
  if (c.blunting >= 3.5 && c.monitoring < 2.5) result.push({ tag: "Coping style", text: "You lean toward blunting (less internal detail). Favour distraction / automaticity cues and keep sensation dashboards minimal." });
  if (c.promotion - c.prevention >= 1) result.push({ tag: "Framing", text: "Promotion-focused — goals framed as gains (“extend your range”) will fit you better." });
  if (c.prevention - c.promotion >= 1) result.push({ tag: "Framing", text: "Prevention-focused — goals framed as safety/control (“stay calm and controlled”) will fit you better." });
  if (c.performanceAvoidance - c.masteryApproach >= 1) result.push({ tag: "Goal focus", text: "Performance-avoidance leaning — reframing targets around personal mastery (“improve the skill”) rather than not-failing tends to lower pressure and sustain motivation." });
  if (c.masteryApproach - c.performanceAvoidance >= 1.5) result.push({ tag: "Goal focus", text: "Strong mastery orientation — a real asset; keep goals framed around skill improvement and it will keep driving steady progress." });
  return result;
}

const programMap = {
  regulation: { neurofeedback: "calm", program: "nerves", mechanism: "The module trains a settling frontal-alpha state — calm on command — and the program reframes the nerves themselves instead of fighting them." },
  attentional_control: { neurofeedback: "focus", program: "focus", mechanism: "The module gives feedback on a quiet, non-over-engaged state (approx. SMR), and the program loosens step-by-step self-control so trained technique can run itself." },
  confidence_flow: { neurofeedback: "calm", program: "confidence", mechanism: "The program surfaces and tests the core beliefs under the doubt, and the module trains a settled state that makes absorbed, self-forgetting focus easier to reach." },
} as const;

function mechanismProgram(c: ConstructScores, context: "avoidance" | "setback") {
  const ranked = [
    { program: "fear", value: n01(c.avoidance), label: "behavioral avoidance" },
    { program: "focus", value: n01(c.reinvestment), label: "over-analysis / reinvestment" },
    { program: "setback", value: .5 * n01(c.negativeSelfTalk) + .5 * (1 - n01(c.efficacy)), label: "harsh self-judgement & withdrawal" },
  ].sort((a, b) => b.value - a.value);
  const decisive = ranked[0].value - ranked[1].value >= .11;
  const fallback = context === "setback" ? "setback" : "fear";
  return { program: decisive ? ranked[0].program : fallback, driver: ranked[0].label, ranked, decisive, fallback };
}

function resolve(c: ConstructScores, routing: ReturnType<typeof route>, goalId: AssessmentGoalId) {
  const goal = assessmentGoals.find((item) => item.id === goalId)!;
  const scoreLed = (routing.ranked[0]?.pct ?? 100) - (routing.ranked[1]?.pct ?? 0) >= BLEND_MARGIN;
  if (goal.type === "mechanism") {
    const mechanism = mechanismProgram(c, goal.context);
    return { basis: "goal+mechanism", program: mechanism.program, neurofeedback: mechanism.program === "focus" ? "focus" : "calm", note: `Your goal is situation-defined; the plan follows how you tend to respond (${mechanism.driver}).`, mechanism, goal, scoreLed, balanced: !scoreLed };
  }
  if (goal.type === "program") return { basis: "goal+program", program: goal.program, neurofeedback: "calm", note: "Routed to the program your stated goal names directly.", goal, scoreLed, balanced: !scoreLed };
  if (scoreLed) {
    const map = programMap[routing.dominant.id];
    const panic = routing.dominant.id === "regulation" && c.somatic >= 3.5 && c.somatic - c.worry >= .5 && c.somatic - c.concentration >= .5;
    const secondaryPathway = goal.type === "pathway" && goal.pathway !== routing.dominant.id ? goal.pathway : null;
    return { basis: "score-led", program: panic ? "panic" : map.program, neurofeedback: map.neurofeedback, mechanism: map.mechanism, swapped: panic, secondaryPathway, goal, note: secondaryPathway ? "Your scores point clearly here; your stated goal is queued as a secondary focus." : "Your scores point clearly to this focus.", scoreLed: true, balanced: false };
  }
  if (goal.type === "pathway") {
    const map = programMap[goal.pathway as PathwayId];
    return { basis: "balanced+goal", program: "program" in goal ? goal.program : map.program, neurofeedback: map.neurofeedback, note: "Your profile is evenly balanced across areas — a stable platform, not a deficit. Since no single area stands out, your plan follows the goal you chose.", goal, scoreLed: false, balanced: true };
  }
  return { basis: "balanced+foundational", program: "foundational", neurofeedback: null, note: "Your profile is evenly balanced across areas — a genuine strength. There's no single stand-out to target, so a short foundational program fits best. Pick a goal any time to focus the work.", goal, scoreLed: false, balanced: true };
}

export function scorePerformanceProfile(responses: AssessmentResponses, stateResponses: AssessmentResponses, goal: AssessmentGoalId) {
  const constructs = calculateConstructScores(responses);
  const pathways = route(constructs);
  return {
    version: PERFORMANCE_PROFILE_VERSION,
    goal,
    constructs,
    pathways,
    dominant: pathways.dominant,
    drivers: explain(constructs, pathways.dominant.id),
    modifiers: modifiers(constructs),
    style: scoreStyle(responses),
    state: stateResponses,
    plan: resolve(constructs, pathways, goal),
    safety: "This profile describes tendencies for dry mental preparation. It is not a diagnosis and does not replace freediving instruction or in-water safety supervision.",
  };
}

export type PerformanceProfileResult = ReturnType<typeof scorePerformanceProfile>;
