import { relations, sql } from "drizzle-orm";
import { diveDisciplines, experienceLevels } from "@/lib/profile-options";
import {
  check,
  boolean,
  date,
  index,
  integer,
  bigint,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const experienceLevel = pgEnum("experience_level", experienceLevels);

export const diveDiscipline = pgEnum("dive_discipline", diveDisciplines);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 100 }).default("Diver").notNull(),
    email: varchar("email", { length: 320 }).notNull(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("users_email_lower_unique").on(sql`lower(${table.email})`),
    check("users_email_not_blank", sql`length(btrim(${table.email})) > 0`),
  ],
);

export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    displayName: varchar("display_name", { length: 100 }).notNull(),
    experienceLevel: experienceLevel("experience_level").notNull(),
    primaryDiscipline: diveDiscipline("primary_discipline").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("profiles_user_id_unique").on(table.userId),
    check("profiles_display_name_not_blank", sql`length(btrim(${table.displayName})) > 0`),
  ],
);

export const dives = pgTable(
  "dives",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    diveDate: date("dive_date", { mode: "string" }).notNull(),
    diveTime: varchar("dive_time", { length: 5 }),
    discipline: diveDiscipline("discipline").notNull(),
    depthMeters: numeric("depth_meters", { precision: 6, scale: 2, mode: "number" }).notNull(),
    durationSeconds: integer("duration_seconds").notNull(),
    location: varchar("location", { length: 200 }),
    perceivedEffort: smallint("perceived_effort"),
    comfort: smallint("comfort"),
    isPersonalBest: boolean("is_personal_best").default(false).notNull(),
    waterCondition: varchar("water_condition", { length: 20 }),
    visibility: varchar("visibility", { length: 20 }),
    currentStrength: varchar("current_strength", { length: 20 }),
    equipment: text("equipment"),
    preDiveNerves: smallint("pre_dive_nerves"),
    calmAtDepth: smallint("calm_at_depth"),
    focus: smallint("focus"),
    equalization: smallint("equalization"),
    overallFeel: smallint("overall_feel"),
    mentalPreparation: text("mental_preparation").array(),
    notableEvent: varchar("notable_event", { length: 80 }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("dives_user_date_idx").on(table.userId, table.diveDate),
    check("dives_depth_nonnegative", sql`${table.depthMeters} >= 0`),
    check("dives_duration_positive", sql`${table.durationSeconds} > 0`),
    check("dives_perceived_effort_range", sql`${table.perceivedEffort} between 1 and 10`),
    check("dives_comfort_range", sql`${table.comfort} between 1 and 5`),
    check("dives_pre_dive_nerves_range", sql`${table.preDiveNerves} between 1 and 5`),
    check("dives_calm_at_depth_range", sql`${table.calmAtDepth} between 1 and 5`),
    check("dives_focus_range", sql`${table.focus} between 1 and 5`),
    check("dives_equalization_range", sql`${table.equalization} between 1 and 5`),
    check("dives_overall_feel_range", sql`${table.overallFeel} between 1 and 5`),
  ],
);

export const trainingSessions = pgTable(
  "training_sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    sessionDate: date("session_date", { mode: "string" }).notNull(),
    sessionTime: varchar("session_time", { length: 5 }),
    sessionType: varchar("session_type", { length: 80 }).notNull(),
    sessionCategory: varchar("session_category", { length: 20 }).default("training").notNull(),
    durationMinutes: integer("duration_minutes").notNull(),
    difficulty: smallint("difficulty"),
    poolDiscipline: varchar("pool_discipline", { length: 12 }),
    distanceMeters: numeric("distance_meters", { precision: 7, scale: 2, mode: "number" }),
    poolLengthMeters: smallint("pool_length_meters"),
    sessionEffort: smallint("session_effort"),
    preSessionNerves: smallint("pre_session_nerves"),
    calmRating: smallint("calm_rating"),
    focusRating: smallint("focus_rating"),
    overallFeel: smallint("overall_feel"),
    bestHoldSeconds: integer("best_hold_seconds"),
    holdCount: smallint("hold_count"),
    holdPosition: varchar("hold_position", { length: 20 }),
    urgeToBreathe: smallint("urge_to_breathe"),
    tableType: varchar("table_type", { length: 12 }),
    tableRounds: smallint("table_rounds"),
    completedRounds: smallint("completed_rounds"),
    holdSeconds: integer("hold_seconds"),
    restSeconds: integer("rest_seconds"),
    supervisionAttested: boolean("supervision_attested").default(false).notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("training_sessions_user_date_idx").on(table.userId, table.sessionDate),
    check("training_sessions_type_not_blank", sql`length(btrim(${table.sessionType})) > 0`),
    check("training_sessions_duration_positive", sql`${table.durationMinutes} > 0`),
    check("training_sessions_difficulty_range", sql`${table.difficulty} between 1 and 5`),
    check("training_sessions_category", sql`${table.sessionCategory} in ('training', 'pool', 'dry_hold', 'table')`),
    check("training_sessions_effort_range", sql`${table.sessionEffort} between 1 and 5`),
    check("training_sessions_pre_session_nerves_range", sql`${table.preSessionNerves} between 1 and 5`),
    check("training_sessions_calm_rating_range", sql`${table.calmRating} between 1 and 5`),
    check("training_sessions_focus_rating_range", sql`${table.focusRating} between 1 and 5`),
    check("training_sessions_overall_feel_range", sql`${table.overallFeel} between 1 and 5`),
    check("training_sessions_urge_range", sql`${table.urgeToBreathe} between 1 and 5`),
    check("training_sessions_distance_positive", sql`${table.distanceMeters} > 0`),
    check("training_sessions_best_hold_positive", sql`${table.bestHoldSeconds} > 0`),
    check("training_sessions_hold_count_positive", sql`${table.holdCount} > 0`),
    check("training_sessions_rounds_positive", sql`${table.tableRounds} > 0`),
    check("training_sessions_completed_rounds", sql`${table.completedRounds} between 0 and ${table.tableRounds}`),
  ],
);

export const trainingGoals = pgTable(
  "training_goals",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    goal: varchar("goal", { length: 48 }).notNull(),
    position: smallint("position").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("training_goals_user_goal_unique").on(table.userId, table.goal),
    index("training_goals_user_position_idx").on(table.userId, table.position),
    check("training_goals_position_range", sql`${table.position} between 0 and 2`),
  ],
);

export const performanceAssessments = pgTable(
  "performance_assessments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    version: varchar("version", { length: 20 }).default("v12").notNull(),
    status: varchar("status", { length: 20 }).default("completed").notNull(),
    goal: varchar("goal", { length: 48 }).notNull(),
    responses: jsonb("responses").$type<Record<string, number>>().notNull(),
    stateResponses: jsonb("state_responses").$type<Record<string, number>>().notNull(),
    result: jsonb("result").$type<Record<string, unknown>>().notNull(),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("performance_assessments_user_completed_idx").on(table.userId, table.completedAt),
    check("performance_assessments_status", sql`${table.status} in ('in_progress', 'completed')`),
  ],
);

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: text("token").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("sessions_token_unique").on(table.token),
    index("sessions_user_id_idx").on(table.userId),
  ],
);

export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: text("scope"),
    idToken: text("id_token"),
    password: text("password"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("accounts_provider_account_unique").on(table.providerId, table.accountId),
    index("accounts_user_id_idx").on(table.userId),
  ],
);

export const verifications = pgTable(
  "verifications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("verifications_identifier_idx").on(table.identifier)],
);

export const rateLimits = pgTable(
  "rate_limits",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    key: text("key").notNull(),
    count: integer("count").notNull(),
    lastRequest: bigint("last_request", { mode: "number" }).notNull(),
  },
  (table) => [uniqueIndex("rate_limits_key_unique").on(table.key)],
);

export const whoopConnections = pgTable(
  "whoop_connections",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    whoopUserId: varchar("whoop_user_id", { length: 64 }).notNull(),
    accessTokenEncrypted: text("access_token_encrypted").notNull(),
    refreshTokenEncrypted: text("refresh_token_encrypted").notNull(),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }).notNull(),
    scopes: text("scopes").notNull(),
    refreshLeaseExpiresAt: timestamp("refresh_lease_expires_at", { withTimezone: true }),
    connectedAt: timestamp("connected_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("whoop_connections_user_id_unique").on(table.userId),
    uniqueIndex("whoop_connections_whoop_user_id_unique").on(table.whoopUserId),
  ],
);

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles),
  whoopConnection: one(whoopConnections),
  dives: many(dives),
  trainingSessions: many(trainingSessions),
  trainingGoals: many(trainingGoals),
  performanceAssessments: many(performanceAssessments),
  sessions: many(sessions),
  accounts: many(accounts),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, { fields: [profiles.userId], references: [users.id] }),
}));

export const divesRelations = relations(dives, ({ one }) => ({
  user: one(users, { fields: [dives.userId], references: [users.id] }),
}));

export const trainingSessionsRelations = relations(trainingSessions, ({ one }) => ({
  user: one(users, { fields: [trainingSessions.userId], references: [users.id] }),
}));

export const trainingGoalsRelations = relations(trainingGoals, ({ one }) => ({
  user: one(users, { fields: [trainingGoals.userId], references: [users.id] }),
}));

export const performanceAssessmentsRelations = relations(performanceAssessments, ({ one }) => ({
  user: one(users, { fields: [performanceAssessments.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const whoopConnectionsRelations = relations(whoopConnections, ({ one }) => ({
  user: one(users, { fields: [whoopConnections.userId], references: [users.id] }),
}));
