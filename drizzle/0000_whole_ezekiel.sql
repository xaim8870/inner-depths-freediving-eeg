CREATE TYPE "public"."dive_discipline" AS ENUM('constant_weight', 'free_immersion', 'no_fins', 'dynamic', 'static', 'fun_dive');--> statement-breakpoint
CREATE TYPE "public"."experience_level" AS ENUM('beginner', 'intermediate', 'advanced');--> statement-breakpoint
CREATE TABLE "dives" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"dive_date" date NOT NULL,
	"discipline" "dive_discipline" NOT NULL,
	"depth_meters" numeric(6, 2) NOT NULL,
	"duration_seconds" integer NOT NULL,
	"location" varchar(200),
	"perceived_effort" smallint,
	"comfort" smallint,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "dives_depth_nonnegative" CHECK ("dives"."depth_meters" >= 0),
	CONSTRAINT "dives_duration_positive" CHECK ("dives"."duration_seconds" > 0),
	CONSTRAINT "dives_perceived_effort_range" CHECK ("dives"."perceived_effort" between 1 and 10),
	CONSTRAINT "dives_comfort_range" CHECK ("dives"."comfort" between 1 and 5)
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"display_name" varchar(100) NOT NULL,
	"experience_level" "experience_level" NOT NULL,
	"primary_discipline" "dive_discipline" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_display_name_not_blank" CHECK (length(btrim("profiles"."display_name")) > 0)
);
--> statement-breakpoint
CREATE TABLE "training_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"session_date" date NOT NULL,
	"session_type" varchar(80) NOT NULL,
	"duration_minutes" integer NOT NULL,
	"difficulty" smallint,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "training_sessions_type_not_blank" CHECK (length(btrim("training_sessions"."session_type")) > 0),
	CONSTRAINT "training_sessions_duration_positive" CHECK ("training_sessions"."duration_minutes" > 0),
	CONSTRAINT "training_sessions_difficulty_range" CHECK ("training_sessions"."difficulty" between 1 and 5)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(320) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_not_blank" CHECK (length(btrim("users"."email")) > 0)
);
--> statement-breakpoint
ALTER TABLE "dives" ADD CONSTRAINT "dives_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_sessions" ADD CONSTRAINT "training_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "dives_user_date_idx" ON "dives" USING btree ("user_id","dive_date");--> statement-breakpoint
CREATE UNIQUE INDEX "profiles_user_id_unique" ON "profiles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "training_sessions_user_date_idx" ON "training_sessions" USING btree ("user_id","session_date");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_lower_unique" ON "users" USING btree (lower("email"));