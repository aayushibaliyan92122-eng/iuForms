CREATE TYPE "public"."forms_status_enum" AS ENUM('DRAFT', 'PUBLISHED');--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "form_status" "forms_status_enum" DEFAULT 'DRAFT' NOT NULL;