import { pgTable, uuid, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";
import { userTable } from "./user";


export const formStatusEnum = pgEnum("forms_status_enum" , ["DRAFT" , "PUBLISHED"])

export const formsTable = pgTable("forms", {
  id:uuid().primaryKey().defaultRandom(),
  title : varchar("title", {length:50}).notNull(),
  description: varchar("description" , {length:300}),
  createdBy : uuid("created_By").references(()=> userTable.id),

  createdAt : timestamp("created_At").defaultNow(),
  updatedAt: timestamp("updated_At").$onUpdate(()=> new Date()),
  status : formStatusEnum("form_status").default("DRAFT").notNull()
});
