import {uuid , timestamp , pgTable , json } from "drizzle-orm/pg-core";
import { formsTable } from "./form";


export interface FormSubmissionValue {
    fieldId : string,
    value : string
}

export type FormSubmissionValueRow = FormSubmissionValue[]

export const formSubmissionTable = pgTable("form_submissions" ,{
    id: uuid().primaryKey().defaultRandom(),
    formId : uuid("form_id").references(()=> formsTable.id ,{
  onDelete: "cascade",
}),
    values : json("values").$type<FormSubmissionValueRow>().notNull(),
    createdAt : timestamp("created_at").defaultNow(),
    updatedAt : timestamp("updated_at").$onUpdate(()=> new Date())

})