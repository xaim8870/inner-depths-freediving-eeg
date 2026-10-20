CREATE TABLE "performance_assessments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"version" varchar(20) DEFAULT 'v12' NOT NULL,
	"status" varchar(20) DEFAULT 'completed' NOT NULL,
	"goal" varchar(48) NOT NULL,
	"responses" jsonb NOT NULL,
	"state_responses" jsonb NOT NULL,
	"result" jsonb NOT NULL,
	"started_at" timestamp with time zone NOT NULL,
	"completed_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "performance_assessments_status" CHECK ("performance_assessments"."status" in ('in_progress', 'completed'))
);
--> statement-breakpoint
ALTER TABLE "performance_assessments" ADD CONSTRAINT "performance_assessments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "performance_assessments_user_completed_idx" ON "performance_assessments" USING btree ("user_id","completed_at");