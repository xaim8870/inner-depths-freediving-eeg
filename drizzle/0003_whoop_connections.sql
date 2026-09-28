CREATE TABLE "whoop_connections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"whoop_user_id" varchar(64) NOT NULL,
	"access_token_encrypted" text NOT NULL,
	"refresh_token_encrypted" text NOT NULL,
	"access_token_expires_at" timestamp with time zone NOT NULL,
	"scopes" text NOT NULL,
	"refresh_lease_expires_at" timestamp with time zone,
	"connected_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "whoop_connections" ADD CONSTRAINT "whoop_connections_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "whoop_connections_user_id_unique" ON "whoop_connections" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "whoop_connections_whoop_user_id_unique" ON "whoop_connections" USING btree ("whoop_user_id");