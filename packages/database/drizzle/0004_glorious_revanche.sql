CREATE TABLE "forms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(50) NOT NULL,
	"description" varchar(300),
	"created_By" uuid,
	"created_At" timestamp DEFAULT now(),
	"updated_At" timestamp
);
--> statement-breakpoint
ALTER TABLE "forms" ADD CONSTRAINT "forms_created_By_users_id_fk" FOREIGN KEY ("created_By") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;