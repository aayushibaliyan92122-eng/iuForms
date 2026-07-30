ALTER TABLE "form_fields" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."field_Type_Enum";--> statement-breakpoint
CREATE TYPE "public"."field_Type_Enum" AS ENUM('NUMBER', 'YES_NO', 'TEXT', 'EMAIL', 'PASSWORD');--> statement-breakpoint
ALTER TABLE "form_fields" ALTER COLUMN "type" SET DATA TYPE "public"."field_Type_Enum" USING "type"::"public"."field_Type_Enum";