import { pgTable, uuid, timestamp, varchar } from "drizzle-orm/pg-core";
import { userTable } from "./user";
import { date } from "zod";

export const formsTable = pgTable("forms", {
  id:uuid().primaryKey().defaultRandom(),
  title : varchar("title", {length:50}).notNull(),
  description: varchar("description" , {length:300}),
  createdBy : uuid("created_By").references(()=> userTable.id),

  createdAt : timestamp("created_At").defaultNow(),
  updatedAt: timestamp("updated_At").$onUpdate(()=> new Date())
});
