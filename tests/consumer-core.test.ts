import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { completedSessionSchema, toCompletedSessionValues } from "../src/lib/completed-session-validation.ts";
import { isCompletedDateTime } from "../src/lib/retrospective-session.ts";
import { trainingGoalSelectionSchema } from "../src/lib/training-goals.ts";
import { deriveHomeInsight } from "../src/lib/home-insight.ts";
import { assessmentGoals, assessmentItems, stateItems, styleItems } from "../src/lib/performance-profile/definitions.ts";
import { scorePerformanceProfile } from "../src/lib/performance-profile/scoring.ts";
import { performanceProfileSubmissionSchema } from "../src/lib/performance-profile/validation.ts";

const base = {
  sessionDate: "2025-01-01", sessionTime: "10:00", durationMinutes: 30,
  notes: "", supervisionAttested: true as const,
  preSessionNerves: undefined, calmRating: undefined, focusRating: undefined, overallFeel: undefined,
  poolDiscipline: undefined, distanceMeters: undefined, poolLengthMeters: undefined, sessionEffort: undefined,
  bestHoldSeconds: undefined, holdCount: undefined, holdPosition: undefined, urgeToBreathe: undefined,
  tableType: undefined, tableRounds: undefined, completedRounds: undefined, holdSeconds: undefined, restSeconds: undefined,
};

test("future dates and future same-day times are rejected", () => {
  assert.equal(isCompletedDateTime("2035-01-01", "10:00", new Date(2026, 0, 1, 12, 0)), false);
  assert.equal(isCompletedDateTime("2026-01-01", "13:00", new Date(2026, 0, 1, 12, 0)), false);
  assert.equal(isCompletedDateTime("2026-01-01", "11:59", new Date(2026, 0, 1, 12, 0)), true);
});

for (const [category, fields] of [
  ["pool", { poolDiscipline: "DYN", distanceMeters: 50, poolLengthMeters: 25, sessionEffort: 3 }],
  ["dry_hold", { bestHoldSeconds: 120, holdCount: 4, holdPosition: "Lying", urgeToBreathe: 3 }],
  ["table", { tableType: "CO2", tableRounds: 8, completedRounds: 7, holdSeconds: 90, restSeconds: 60 }],
] as const) {
  test(`${category} requires supervision`, () => {
    assert.equal(completedSessionSchema.safeParse({ ...base, ...fields, sessionCategory: category, supervisionAttested: false }).success, false);
  });
}

test("a retrospective completed table maps to canonical training_sessions values", () => {
  const result = completedSessionSchema.safeParse({ ...base, sessionCategory: "table", tableType: "CO2", tableRounds: 8, completedRounds: 7, holdSeconds: 90, restSeconds: 60 });
  assert.equal(result.success, true);
  if (!result.success) return;
  const values = toCompletedSessionValues(result.data);
  assert.equal(values.sessionCategory, "table"); assert.equal(values.completedRounds, 7); assert.equal(values.supervisionAttested, true);
});

test("training goals allow at most three supported values", () => {
  assert.equal(trainingGoalSelectionSchema.safeParse(["calm_nerves", "focus_attention", "confidence"]).success, true);
  assert.equal(trainingGoalSelectionSchema.safeParse(["calm_nerves", "focus_attention", "confidence", "flow"]).success, false);
});

test("Home insight has truthful empty and populated states", () => {
  assert.match(deriveHomeInsight([]).body, /Keep logging/);
  const populated = deriveHomeInsight([2, 4, 5]);
  assert.match(populated.body, /3\.7\/5/); assert.match(populated.body, /does not explain what caused/);
});

test("owned read, update, and delete paths retain both id and user ownership predicates", () => {
  for (const file of ["src/db/completed-sessions.ts", "src/app/app/log/sessions/actions.ts", "src/app/app/log/actions.ts", "src/app/app/train/actions.ts"]) {
    const source = readFileSync(file, "utf8");
    assert.match(source, /userId/); assert.match(source, /\.id/); assert.match(source, /eq\(/);
  }
});

test("goal persistence is authenticated and transaction-backed", () => {
  const source = readFileSync("src/app/app/train/goals-actions.ts", "utf8");
  // atomic via db.batch: neon-http does not support db.transaction
  assert.match(source, /requireCurrentUser/); assert.match(source, /db\.batch\(/); assert.match(source, /userId: user\.id/);
});

test("Home exposes connected and disconnected WHOOP states without sample biometrics", () => {
  const source = readFileSync("src/app/app/home/page.tsx", "utf8");
  assert.match(source, /WHOOP connected/); assert.match(source, /Connect WHOOP/);
  assert.doesNotMatch(source, /HRV|Recovery|Strain|Sleep/);
});

test("drawer destinations and session filters are explicit", () => {
  const drawer = readFileSync("src/components/shell/nav-items.ts", "utf8") + readFileSync("src/components/shell/top-bar.tsx", "utf8");
  for (const href of ["/app/profile", "/app/performance-profile", "/app/account", "/privacy"]) assert.match(drawer, new RegExp(href.replaceAll("/", "\\/")));
  const log = readFileSync("src/app/app/log/page.tsx", "utf8");
  for (const type of ["dive", "pool", "dry_hold", "table"]) assert.match(log, new RegExp(type));
});

const completeAssessmentResponses = Object.fromEntries([...assessmentItems, ...styleItems].map((item) => [item.id, 3]));
const completeStateResponses = Object.fromEntries(stateItems.map((item) => [item.id, 3]));

test("Performance Profile requires every reference answer", () => {
  const missing = { ...completeAssessmentResponses };
  delete missing[assessmentItems[0].id];
  assert.equal(performanceProfileSubmissionSchema.safeParse({ goal: assessmentGoals[0].id, responses: missing, stateResponses: completeStateResponses, startedAt: new Date(2025, 0, 1) }).success, false);
  assert.equal(performanceProfileSubmissionSchema.safeParse({ goal: assessmentGoals[0].id, responses: completeAssessmentResponses, stateResponses: completeStateResponses, startedAt: new Date(2025, 0, 1) }).success, true);
});

test("v12 scoring is deterministic and preserves a balanced result", () => {
  const first = scorePerformanceProfile(completeAssessmentResponses, completeStateResponses, "none");
  const second = scorePerformanceProfile(completeAssessmentResponses, completeStateResponses, "none");
  assert.deepEqual(first, second);
  assert.equal(first.pathways.ranked.reduce((sum, pathway) => sum + pathway.pct, 0), 100);
  assert.equal(first.pathways.blend, true);
  assert.equal(first.plan.program, "foundational");
});

test("assessment persistence is authenticated, user-scoped, and append-only for retakes", () => {
  const action = readFileSync("src/app/app/performance-profile/actions.ts", "utf8");
  const query = readFileSync("src/db/performance-assessments.ts", "utf8");
  assert.match(action, /requireCurrentUser/);
  assert.match(action, /insert\(performanceAssessments\)/);
  assert.doesNotMatch(action, /update\(performanceAssessments\)|delete\(performanceAssessments\)/);
  assert.match(query, /performanceAssessments\.userId/);
  assert.match(query, /performanceAssessments\.id/);
});

test("Train and Progress load stored Performance Profile and real overall-feel data", () => {
  assert.match(readFileSync("src/lib/training-plan-server.ts", "utf8"), /getLatestPerformanceAssessment/);
  const progress = readFileSync("src/db/progress.ts", "utf8");
  assert.match(progress, /dives\.overallFeel/);
  assert.doesNotMatch(progress, /dives\.comfort/);
});

test("Home loads the saved Performance Profile instead of hard-coding incomplete", () => {
  const homeQuery = readFileSync("src/db/home.ts", "utf8");
  const trainingStatus = readFileSync("src/app/app/home/page.tsx", "utf8");
  assert.match(homeQuery, /getLatestPerformanceAssessment/);
  assert.doesNotMatch(homeQuery, /performanceProfileStatus:\s*"not_completed"/);
  assert.match(trainingStatus, /performanceProfile \?/);
});

test("menu button keeps a 44px touch target with a centered icon", () => {
  const css = readFileSync("src/app/ui.css", "utf8");
  assert.match(css, /\.ui-icon-btn \{[^}]*width: 44px;[^}]*height: 44px;[^}]*align-items: center;[^}]*justify-content: center;/);
  assert.match(readFileSync("src/components/shell/top-bar.tsx", "utf8"), /aria-label="Open menu"/);
});
