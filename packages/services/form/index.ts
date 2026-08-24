import { db, eq, count, countDistinct, desc ,and } from "@repo/database";
import { formsTable } from "@repo/database/models/form";
import { fieldTypeEnum, formFieldsTable } from "@repo/database/models/form-fields";
import { formSubmissionTable } from "@repo/database/models/form-submission";

import { createFormInput, CreateFormInputType, listFormByUserIdInput, ListFormByUserIdInputType, UpdateFormInputType, updateFormInput,deleteFormInput,DeleteFormInputType, UpdateFormStatusInputType, updateformStatusInput } from "./model";
import { formatError } from "zod";
import { userTable } from "@repo/database/models/user";


export default class FormService{
   public async createForm(payload:CreateFormInputType) {

    const {title,description,createdBy} = await createFormInput.parseAsync(payload)

    try {
  const result = await db
    .insert(formsTable)
    .values({
      title,
      description,
      createdBy,
    })
    .returning({
      id: formsTable.id,
    });

  console.log("FORM RESULT:", result);

  return {
    id: result[0]!.id,
  };
} catch (error) {
  console.error("DATABASE ERROR:", error);
  throw error;
}

  
   }

   public async listFormByUserId(payload:ListFormByUserIdInputType){
      const {userId} = await listFormByUserIdInput.parseAsync(payload)

      const forms = await db
        .select({
          id: formsTable.id,
          title : formsTable.title,
          description : formsTable.description,
          status : formsTable.status,
          createdAt : formsTable.createdAt,
          updatedAt :formsTable.updatedAt
        })
        .from(formsTable)
        .where(eq(formsTable.createdBy , userId))

      return{forms}
   }

   public async getDashboardStats(userId: string) {
      const totalFormsRow = await db
        .select({ totalForms: count() })
        .from(formsTable)
        .where(eq(formsTable.createdBy, userId));

      const totalFieldsRow = await db
        .select({ totalFields: count() })
        .from(formFieldsTable)
        .leftJoin(formsTable, eq(formFieldsTable.formId, formsTable.id))
        .where(eq(formsTable.createdBy, userId));

      const totalResponsesRow = await db
        .select({ totalResponses: count() })
        .from(formSubmissionTable)
        .leftJoin(formsTable, eq(formSubmissionTable.formId, formsTable.id))
        .where(eq(formsTable.createdBy, userId));

      return {
        totalForms: Number(totalFormsRow[0]?.totalForms ?? 0),
        totalFields: Number(totalFieldsRow[0]?.totalFields ?? 0),
        totalResponses: Number(totalResponsesRow[0]?.totalResponses ?? 0),
      };
    }

    public async listFormsWithCountsByUserId(userId: string) {
      const rows = await db
        .select({
          id: formsTable.id,
          title: formsTable.title,
          description: formsTable.description,
          createdAt: formsTable.createdAt,
          updatedAt: formsTable.updatedAt,
          responseCount: countDistinct(formSubmissionTable.id),
          fieldCount: countDistinct(formFieldsTable.id),
        })
        .from(formsTable)
        .leftJoin(formFieldsTable, eq(formFieldsTable.formId, formsTable.id))
        .leftJoin(formSubmissionTable, eq(formSubmissionTable.formId, formsTable.id))
        .where(eq(formsTable.createdBy, userId))
        .groupBy(
          formsTable.id,
          formsTable.title,
          formsTable.description,
          formsTable.createdAt,
          formsTable.updatedAt,
        )
        .orderBy(desc(formsTable.updatedAt));

      return rows.map((row) => ({
        id: row.id,
        title: row.title,
        description: row.description ?? null,
        createdAt: row.createdAt ? row.createdAt.toISOString() : null,
        updatedAt: row.updatedAt ? row.updatedAt.toISOString() : null,
        responseCount: Number(row.responseCount ?? 0),
        fieldCount: Number(row.fieldCount ?? 0),
      }));
    }

  
   public async getFormWithFields(formId: string) {
        const rows = await db
            .select({
                id: formsTable.id,
                title: formsTable.title,
                description: formsTable.description,
                createdAt: formsTable.createdAt,
                updatedAt: formsTable.updatedAt,

                field_id: formFieldsTable.id,
                field_formId: formFieldsTable.formId,
                field_label: formFieldsTable.label,
                field_labelKey: formFieldsTable.labelKey,
                field_description: formFieldsTable.description,
                field_placeholder: formFieldsTable.placeholder,
                field_isRequired: formFieldsTable.isRequired,
                field_index: formFieldsTable.index,
                field_type: formFieldsTable.type,
                field_createdAt: formFieldsTable.createdAt,
                field_updatedAt: formFieldsTable.updatedAt,
            })
            .from(formsTable)
            .leftJoin(formFieldsTable, eq(formFieldsTable.formId, formsTable.id))
            .where(and
               (eq(formsTable.id, formId),
                eq(formsTable.status , "PUBLISHED")
              ))
            .orderBy(formFieldsTable.index);

        /*
        {formdetails, field details},
        {formdetails, field details},
        {formdetails, field details}
            */

        if (!rows || rows.length === 0) throw new Error(`Form with ID ${formId} not found`);

        const first = rows[0]!;

        const form = {
            id: first.id,
            title: first.title,
            description: first.description ?? null,
            createdAt: first.createdAt ? first.createdAt.toISOString() : null,
            updatedAt: first.updatedAt ? first.updatedAt.toISOString() : null,
            fields: [] as Array<any>,
        };

        for (const r of rows) {
            if (!r.field_id) continue;

            form.fields.push({
                id: r.field_id,
                formId: r.field_formId,
                label: r.field_label,
                labelKey: r.field_labelKey,
                description: r.field_description ?? null,
                placeholder: r.field_placeholder ?? null,
                isRequired: r.field_isRequired,
                index: r.field_index!.toString(),
                type: r.field_type,
                createdAt: r.field_createdAt ? r.field_createdAt.toISOString() : null,
                updatedAt: r.field_updatedAt ? r.field_updatedAt.toISOString() : null,
            });
        }

        return form;
    }

public async updateForms(
  payload: UpdateFormInputType,
  userId: string
) {
  // Validate the request and extract its values
  const {
    title,
    description,
    formId,
  } = await updateFormInput.parseAsync(payload);

  // Find the exact form and verify that it belongs to the logged-in user
  const verifiedForms = await db
    .select({
      formId: formsTable.id,
      description: formsTable.description,
      title: formsTable.title,
    })
    .from(formsTable)
    .where(
      and(
        eq(formsTable.id, formId),
        eq(formsTable.createdBy, userId)
      )
    );

  // Empty array means the form either does not exist
  // or does not belong to this user
  if (verifiedForms.length === 0) {
    throw new Error(
      "Form not found or you are not authorized to update it"
    );
  }

  const currentForm = verifiedForms[0];

  type FormUpdates = Omit<UpdateFormInputType, "formId">;

  const updates: FormUpdates = {};

  // Only add description when the client provided it
  // and it differs from the stored value
  if (
    description !== undefined &&
    description !== currentForm?.description
  ) {
    updates.description = description;
  }

  // Only add title when it actually changed
  if (
    title !== undefined &&
    title !== currentForm?.title
  ) {
    updates.title = title;
  }

  // The request contained editable fields,
  // but their values were identical to the existing values
  if (Object.keys(updates).length === 0) {
    throw new Error("No changes detected");
  }

  // Update the exact verified form
  const result = await db
    .update(formsTable)
    .set(updates)
    .where(eq(formsTable.id, formId))
    .returning();

  if (result.length === 0) {
    throw new Error(
      "Something went wrong while updating the form"
    );
  }

  return result[0];
}

public async deleteForms(
  payload: DeleteFormInputType,
  userId: string
) {
  const { formId } = await deleteFormInput.parseAsync(payload);

  // Verify that the exact form exists and belongs to the logged-in user
  const verifiedForm = await db
    .select({
      formId: formsTable.id,
    })
    .from(formsTable)
    .where(
      and(
        eq(formsTable.id, formId),
        eq(formsTable.createdBy, userId)
      )
    );

  if (verifiedForm.length === 0) {
    throw new Error(
      "Form not found or you are not authorized to delete it"
    );
  }

  const [deletedForm] = await db
    .delete(formsTable)
    .where(eq(formsTable.id, formId))
    .returning();

  if (!deletedForm) {
    throw new Error("Failed to delete form");
  }
console.log("deletedform" , deletedForm)
  return deletedForm;
}


public async updateFormStatus(payload : UpdateFormStatusInputType , userId : string){

const {formId,status} = await updateformStatusInput.parseAsync(payload)

 

const authenticatedForm = await db
          .select({id : formsTable.id})
          .from(formsTable)
          .where(
            and (
              eq(formsTable.id , formId),
              eq(formsTable.createdBy , userId)
            ))


if(authenticatedForm.length===0){
  throw new Error("Form not found or you are not authorized to update it")
}

// If the user is trying to publish the form,
// make sure the form has at least one field.
if(status === "PUBLISHED"){
  const fields = await db
  .select({ id: formFieldsTable.id })
  .from(formFieldsTable)
  .where(eq(formFieldsTable.formId, formId))
  .limit(1);

  if(fields.length===0){
    throw new Error("add atleast one field before publishing")
  }
  
}
// We only need this check for PUBLISHED.
// Changing a form back to DRAFT does not require any field check.

// Find at least one field that belongs to this form.

// If no field exists,
// do not allow the form to be published.

// If at least one field exists,
// continue and update the form status.
      
const [updatedForm] = await db
  .update(formsTable)
  .set({ status })
  .where(
    and(
      eq(formsTable.id, formId),
      eq(formsTable.createdBy, userId)
    )
  )
  .returning();

console.log("UPDATED FORM:", updatedForm);


if (!updatedForm) {
  throw new Error("failed to update form status");
}

return updatedForm;
}


}