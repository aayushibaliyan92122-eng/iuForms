//user ka schemma likhna yha
import { uuid,varchar, pgTable,timestamp } from "drizzle-orm/pg-core";

export const userTable = pgTable("users",{
    id :uuid("id").primaryKey().defaultRandom().unique().notNull(),
    fullName: varchar("full_name" , {length :100}).notNull(),
    email : varchar("email" , {length:255}).notNull().unique(),
    passwordHash : varchar("password_hash" , {length:255}).notNull(),
     createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date())

})

