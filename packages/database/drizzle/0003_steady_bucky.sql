ALTER TABLE "forms" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "forms_fields" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "form_submissions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "forms" CASCADE;--> statement-breakpoint
DROP TABLE "forms_fields" CASCADE;--> statement-breakpoint
DROP TABLE "form_submissions" CASCADE;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password_hash" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password_hash" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_id_unique" UNIQUE("id");--> statement-breakpoint
DROP TYPE "public"."field_type_enum";