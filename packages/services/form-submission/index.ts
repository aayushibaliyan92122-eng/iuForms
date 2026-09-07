import {db , eq , and} from "@repo/database"
import {formSubmissionTable} from "@repo/database/models/form-submission"
import {createSubmissionInput , CreateSubmissionInputType} from "./model"
import { formsTable } from "@repo/database/models/form"
import { formFieldsTable } from "@repo/database/models/form-fields"
import {z} from "zod"
export default class FormSubmissionService{
    public async createSubmission(payload : CreateSubmissionInputType){
        const {formId , values} = await createSubmissionInput.parseAsync(payload)

        const allowSubmission = await db 
                        .select({id : formsTable.id})
                        .from(formsTable)
                        .where(
                            and(
                                eq(formsTable.id , formId),
                                eq(formsTable.status , "PUBLISHED")
                               
                            )
                        )

            if(allowSubmission.length === 0){
                throw new Error("Form is not accepting submissions")
            }
        
           const formFields = await db
  .select({
    id: formFieldsTable.id,
    isRequired : formFieldsTable.isRequired,
    type : formFieldsTable.type
  })
  .from(formFieldsTable)
  .where(
    eq(formFieldsTable.formId, formId)
  );
      

    const areFieldsValid = values.every(
  submittedValue =>
    formFields.some(
      realField =>
        realField.id === submittedValue.fieldId
    )
)

if(!areFieldsValid){
    throw new Error("these fields not match to the fields this form have")
}


for (const submittedValue of values) {
  const realField = formFields.find(
    (field) => field.id === submittedValue.fieldId
  );

  // Safety check.
  // Normally this should already be guaranteed by areFieldsValid.
  if (!realField) {
    throw new Error("Submitted field does not belong to this form");
  }


  const value = submittedValue.value.trim();

  if (!realField.isRequired && value === "") {
  continue;
}

  switch (realField.type) {
    case "EMAIL": {
      const emailResult = z
        .email()
        .safeParse(value);

      if (!emailResult.success) {
        throw new Error("Please enter a valid email");
      }

      break;
    }

    case "NUMBER": {
      // "" would otherwise become 0 with Number("")
      if (
        value === "" ||
        !Number.isFinite(Number(value))
      ) {
        throw new Error("Please enter a valid number");
      }

      break;
    }

    case "YES_NO": {
      // Assuming your frontend sends "YES" or "NO"
      if (
        value !== "YES" &&
        value !== "NO"
      ) {
        throw new Error(
          "Please select either YES or NO"
        );
      }

      break;
    }

    case "TEXT": {
      // No additional type validation needed.
      // createSubmissionInput already guarantees
      // that value is a string.
      break;
    }

    case "PASSWORD": {
      // For now it is also simply a string.
      // We can add password rules later if your
      // form builder supports min length etc.
      break;
    }

    default: {
      throw new Error("Unsupported field type");
    }
  }
}

 const areRequiredFieldsPresent = formFields.every(
  (realField) => {
    // Optional field? It does not need to be submitted.
    if (!realField.isRequired) {
      return true;
    }




    // Required field?
    // Check whether the submitted values contain this field.
    return values.some(
      (submittedValue) =>
        submittedValue.fieldId === realField.id &&( submittedValue.value.trim() !== "")



  
    );
  }
  
);

if (!areRequiredFieldsPresent) {
  throw new Error("Please fill all required fields");
}

 



        const result = await db
                .insert(formSubmissionTable)
                .values({
                    formId ,
                    values
                })
                
                .returning(
                    {
                        id: formSubmissionTable.id ,
                        createdAt : formSubmissionTable.createdAt
                    }
                )



 

                if(!result || result.length === 0 || !result[0]?.id ){
                    throw new Error("something went wrong while creating the submission")
                }

                return {
                    id : result[0].id,
                    createdAt : result[0].createdAt ? result[0].createdAt.toISOString() : null
                
            }
   }

   public async getSubmissionByFormId(formId: string , userId : string){


     const ownedForm = await db
    .select({
      id: formsTable.id,
    })
    .from(formsTable)
    .where(
      and(
        eq(formsTable.id, formId),
        eq(formsTable.createdBy, userId)
      )
    );

  if (ownedForm.length === 0) {
    throw new Error(
    "Form not found or you are not authorized to view submissions"
    );
  }

    const rows = await db
                .select({
                    id : formSubmissionTable.id,
                    values : formSubmissionTable.values,
                    formId: formSubmissionTable.formId,
                    createdAt : formSubmissionTable.createdAt,
                    updatedAt : formSubmissionTable.updatedAt
                })
                .from(formSubmissionTable)
                .where(
                  
                    eq(formSubmissionTable.formId , formId)

                  )
                .orderBy(formSubmissionTable.createdAt)

    return rows.map((r)=>({
        id : r.id,
        formId : r.formId,
        values : r.values,
        createdAt : r.createdAt ? r.createdAt.toISOString() : null,
        updatedAt: r.updatedAt  ? r.updatedAt.toISOString() : null


    }))
   }
}