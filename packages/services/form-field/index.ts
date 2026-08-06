import {and, db ,eq, max } from "@repo/database"

import { formFieldsTable} from "@repo/database/models/form-fields"

import { 
    createFieldInput ,
    CreateFieldInputType ,
    updateFieldInput,
    UpdateFieldInputType,
  deleteFieldInput,
  DeleteFieldInputType
   

   } from "./model"
import { formsTable } from "@repo/database/models/form";
import { userTable } from "@repo/database/models/user";

export function toLabelKey(label :string) :string{
    return label
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_|_$/g, "");
}

export default class FormFieldService{

        public async getNextIndex(formId:string):Promise<string>{
            const result = await db
                .select({maxIndex : max(formFieldsTable.index)})
                .from(formFieldsTable)
                .where(eq(formFieldsTable.formId , formId))

            const current = result[0]?.maxIndex
            const next = current? Number(current) +1 :1

            return next.toString()
        }

        public async createFormField(payload : CreateFieldInputType){
            const {label , type , formId ,description ,placeholder ,isRequired} = await createFieldInput.parseAsync(payload)
            

            const labelKey = toLabelKey(label)
            const index = await this.getNextIndex(formId)

            const result = await db
                            .insert(formFieldsTable)
                            .values({
                                label,
                                labelKey,
                                description,
                                type,
                                placeholder,
                                isRequired,
                                index,
                                formId,
                                

                            })
                            .returning({id: formFieldsTable.id})


            if(!result || result.length===0 || !result[0]?.id){
                throw new Error("Something went wronng while creating the fields of form")
            }

            return( {id:result[0].id , labelKey ,index})
            
        }

        public async getFormField(formId:string){

            const result = await db
                    .select()
                    .from(formFieldsTable)
                    .where(eq(formFieldsTable.formId ,formId))
                    .orderBy(formFieldsTable.index)

            return result.map((r)=> ({
                id: r.id,
                formId:r.formId,
                description: r.description,
                label : r.label,
                labelKey : r.labelKey,
                placeholder:r.placeholder,
                type: r.type,
                index:r.index,
                isRequired :r.isRequired,
                createdAt: r.createdAt ? r.createdAt.toISOString() : null,
                updatedAt: r.updatedAt ? r.updatedAt.toISOString() : null,

            }))

            
        }
        

   public async updateFormField(
  payload: UpdateFieldInputType,
  userId: string,
) {
  // Validate the incoming payload using the service-level Zod schema.
  // This also guarantees that at least one editable property was provided.
  const {
    fieldId,
    label,
    description,
    placeholder,
    type,
    isRequired,
  } = await updateFieldInput.parseAsync(payload);

  // Fetch the current field values and verify that the authenticated
  // user owns the form that this field belongs to.
  //
  // We need the current values because later we will compare them
  // with the incoming values and avoid an unnecessary UPDATE query.
  const verifiedFields = await db
    .select({
      id: formFieldsTable.id,
      label: formFieldsTable.label,
      description: formFieldsTable.description,
      placeholder: formFieldsTable.placeholder,
      type: formFieldsTable.type,
      isRequired: formFieldsTable.isRequired,
    })
    .from(formFieldsTable)
    .innerJoin(
      formsTable,
      eq(formFieldsTable.formId, formsTable.id),
    )
    .where(
      and(
        // Find the requested field.
        eq(formFieldsTable.id, fieldId),

        // Make sure its parent form belongs to the logged-in user.
        eq(formsTable.createdBy, userId),
      ),
    );

  // An empty array means either:
  // 1. the field does not exist, or
  // 2. the logged-in user does not own its form.
  if (verifiedFields.length === 0) {
    throw new Error(
      "Field not found or you are not authorized to update it",
    );
  }

  // We now know this row exists because of the check above.
  const currentField = verifiedFields[0];

  // Create the type for only the editable values.
  // fieldId identifies the row, so it must not be included in .set().
  type FieldUpdates = Omit<UpdateFieldInputType, "fieldId">;

  // This object will contain only values that actually changed.
  const updates: FieldUpdates = {};

  // Add label only when:
  // 1. the client sent it, and
  // 2. it differs from the existing database value.
  if (
    label !== undefined &&
    label !== currentField?.label
  ) {
    updates.label = label;
  }

  // description can currently be undefined in the request.
  // Compare it with the existing nullable database value.
  if (
    description !== undefined &&
    description !== currentField?.description
  ) {
    updates.description = description;
  }

  if (
    placeholder !== undefined &&
    placeholder !== currentField?.placeholder
  ) {
    updates.placeholder = placeholder;
  }

  if (
    type !== undefined &&
    type !== currentField?.type
  ) {
    updates.type = type;
  }

  // Check against undefined rather than using:
  //
  // if (isRequired)
  //
  // because false is also a valid update value.
  if (
    isRequired !== undefined &&
    isRequired !== currentField?.isRequired
  ) {
    updates.isRequired = isRequired;
  }

  // The request contained editable fields, but all submitted values
  // are identical to the current database values.
  //
  // Therefore, do not execute an unnecessary UPDATE query.
  if (Object.keys(updates).length === 0) {
    throw new Error("No changes were made");
  }

  // Update only the values that actually changed.
  // returning() returns the complete updated row.
  const result = await db
    .update(formFieldsTable)
    .set(updates)
    .where(eq(formFieldsTable.id, fieldId))
    .returning();

  // This should normally not happen because we already verified the row,
  // but it protects against unexpected database/update failures.
  if (result.length === 0) {
    throw new Error(
      "Something went wrong while updating the field",
    );
  }

  // Return the updated field to the tRPC procedure.
  return result[0];
}

   public async deleteFormField(
  payload: DeleteFieldInputType,
  userId: string
) {
  // Validate the incoming payload and extract the field ID
  const { fieldId } = await deleteFieldInput.parseAsync(payload);

  // Verify that:
  // 1. The field exists
  // 2. The parent form belongs to the logged-in user
  const verifiedFields = await db
    .select({
      fieldId: formFieldsTable.id,
    })
    .from(formFieldsTable)
    .innerJoin(
      formsTable,
      eq(formFieldsTable.formId, formsTable.id)
    )
    .where(
      and(
        eq(formFieldsTable.id, fieldId),
        eq(formsTable.createdBy, userId)
      )
    );

  // Drizzle returns an empty array when no matching field is found
  if (verifiedFields.length === 0) {
    throw new Error(
      "Field not found or you are not authorized to delete it"
    );
  }

 const [deletedField] = await db
  .delete(formFieldsTable)
  .where(eq(formFieldsTable.id, fieldId))
  .returning();

if (!deletedField) {
  throw new Error("Failed to delete form field");
}

return deletedField
  

}}