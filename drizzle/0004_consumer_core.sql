CREATE TABLE "training_goals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"goal" varchar(48) NOT NULL,
	"position" smallint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "training_goals_position_range" CHECK ("training_goals"."position" between 0 and 2)
);
--> statement-breakpoint
ALTER TABLE "dives" ADD COLUMN "dive_time" varchar(5);--> statement-breakpoint
ALTER TABLE "dives" ADD COLUMN "is_personal_best" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "dives" ADD COLUMN "water_condition" varchar(20);--> statement-breakpoint
ALTER TABLE "dives" ADD COLUMN "visibility" varchar(20);--> statement-breakpoint
ALTER TABLE "dives" ADD COLUMN "current_strength" varchar(20);--> statement-breakpoint
ALTER TABLE "dives" ADD COLUMN "equipment" text;--> statement-breakpoint
ALTER TABLE "dives" ADD COLUMN "pre_dive_nerves" smallint;--> statement-breakpoint
ALTER TABLE "dives" ADD COLUMN "calm_at_depth" smallint;--> statement-breakpoint
ALTER TABLE "dives" ADD COLUMN "focus" smallint;--> statement-breakpoint
ALTER TABLE "dives" ADD COLUMN "equalization" smallint;--> statement-breakpoint
ALTER TABLE "dives" ADD COLUMN "overall_feel" smallint;--> statement-breakpoint
ALTER TABLE "dives" ADD COLUMN "mental_preparation" text[];--> statement-breakpoint
ALTER TABLE "dives" ADD COLUMN "notable_event" varchar(80);--> statement-breakpoint
ALTER TABLE "training_sessions" ADD COLUMN "session_time" varchar(5);--> statement-breakpoint
ALTER TABLE "training_sessions" ADD COLUMN "session_category" varchar(20) DEFAULT 'training' NOT NULL;--> statement-breakpoint
ALTER TABLE "training_sessions" ADD COLUMN "pool_discipline" varchar(12);--> statement-breakpoint
ALTER TABLE "training_sessions" ADD COLUMN "distance_meters" numeric(7, 2);--> statement-breakpoint
ALTER TABLE "training_sessions" ADD COLUMN "pool_length_meters" smallint;--> statement-breakpoint
ALTER TABLE "training_sessions" ADD COLUMN "session_effort" smallint;--> statement-breakpoint
ALTER TABLE "training_sessions" ADD COLUMN "pre_session_nerves" smallint;--> statement-breakpoint
ALTER TABLE "training_sessions" ADD COLUMN "calm_rating" smallint;--> statement-breakpoint
ALTER TABLE "training_sessions" ADD COLUMN "focus_rating" smallint;--> statement-breakpoint
ALTER TABLE "training_sessions" ADD COLUMN "overall_feel" smallint;--> statement-breakpoint
ALTER TABLE "training_sessions" ADD COLUMN "best_hold_seconds" integer;--> statement-breakpoint
ALTER TABLE "training_sessions" ADD COLUMN "hold_count" smallint;--> statement-breakpoint
ALTER TABLE "training_sessions" ADD COLUMN "hold_position" varchar(20);--> statement-breakpoint
ALTER TABLE "training_sessions" ADD COLUMN "urge_to_breathe" smallint;--> statement-breakpoint
ALTER TABLE "training_sessions" ADD COLUMN "table_type" varchar(12);--> statement-breakpoint
ALTER TABLE "training_sessions" ADD COLUMN "table_rounds" smallint;--> statement-breakpoint
ALTER TABLE "training_sessions" ADD COLUMN "completed_rounds" smallint;--> statement-breakpoint
ALTER TABLE "training_sessions" ADD COLUMN "hold_seconds" integer;--> statement-breakpoint
ALTER TABLE "training_sessions" ADD COLUMN "rest_seconds" integer;--> statement-breakpoint
ALTER TABLE "training_sessions" ADD COLUMN "supervision_attested" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "training_goals" ADD CONSTRAINT "training_goals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "training_goals_user_goal_unique" ON "training_goals" USING btree ("user_id","goal");--> statement-breakpoint
CREATE INDEX "training_goals_user_position_idx" ON "training_goals" USING btree ("user_id","position");--> statement-breakpoint
ALTER TABLE "dives" ADD CONSTRAINT "dives_pre_dive_nerves_range" CHECK ("dives"."pre_dive_nerves" between 1 and 5);--> statement-breakpoint
ALTER TABLE "dives" ADD CONSTRAINT "dives_calm_at_depth_range" CHECK ("dives"."calm_at_depth" between 1 and 5);--> statement-breakpoint
ALTER TABLE "dives" ADD CONSTRAINT "dives_focus_range" CHECK ("dives"."focus" between 1 and 5);--> statement-breakpoint
ALTER TABLE "dives" ADD CONSTRAINT "dives_equalization_range" CHECK ("dives"."equalization" between 1 and 5);--> statement-breakpoint
ALTER TABLE "dives" ADD CONSTRAINT "dives_overall_feel_range" CHECK ("dives"."overall_feel" between 1 and 5);--> statement-breakpoint
ALTER TABLE "training_sessions" ADD CONSTRAINT "training_sessions_category" CHECK ("training_sessions"."session_category" in ('training', 'pool', 'dry_hold', 'table'));--> statement-breakpoint
ALTER TABLE "training_sessions" ADD CONSTRAINT "training_sessions_effort_range" CHECK ("training_sessions"."session_effort" between 1 and 5);--> statement-breakpoint
ALTER TABLE "training_sessions" ADD CONSTRAINT "training_sessions_pre_session_nerves_range" CHECK ("training_sessions"."pre_session_nerves" between 1 and 5);--> statement-breakpoint
ALTER TABLE "training_sessions" ADD CONSTRAINT "training_sessions_calm_rating_range" CHECK ("training_sessions"."calm_rating" between 1 and 5);--> statement-breakpoint
ALTER TABLE "training_sessions" ADD CONSTRAINT "training_sessions_focus_rating_range" CHECK ("training_sessions"."focus_rating" between 1 and 5);--> statement-breakpoint
ALTER TABLE "training_sessions" ADD CONSTRAINT "training_sessions_overall_feel_range" CHECK ("training_sessions"."overall_feel" between 1 and 5);--> statement-breakpoint
ALTER TABLE "training_sessions" ADD CONSTRAINT "training_sessions_urge_range" CHECK ("training_sessions"."urge_to_breathe" between 1 and 5);--> statement-breakpoint
ALTER TABLE "training_sessions" ADD CONSTRAINT "training_sessions_distance_positive" CHECK ("training_sessions"."distance_meters" > 0);--> statement-breakpoint
ALTER TABLE "training_sessions" ADD CONSTRAINT "training_sessions_best_hold_positive" CHECK ("training_sessions"."best_hold_seconds" > 0);--> statement-breakpoint
ALTER TABLE "training_sessions" ADD CONSTRAINT "training_sessions_hold_count_positive" CHECK ("training_sessions"."hold_count" > 0);--> statement-breakpoint
ALTER TABLE "training_sessions" ADD CONSTRAINT "training_sessions_rounds_positive" CHECK ("training_sessions"."table_rounds" > 0);--> statement-breakpoint
ALTER TABLE "training_sessions" ADD CONSTRAINT "training_sessions_completed_rounds" CHECK ("training_sessions"."completed_rounds" between 0 and "training_sessions"."table_rounds");