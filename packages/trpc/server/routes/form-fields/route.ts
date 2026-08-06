import {authenticatedProcedure,router,publicProcedure} from "../../trpc"
import { formFieldService } from "../../services"
import { generatePath } from "../../utils/path-generator"

import {
         createFieldOutputModel,
         createFieldInputModel,
         getFieldsInputModel,
         getFieldsOutputModel,
         updateFieldInput,
         UpdateFieldInputType,
         updateFieldOutput,
         deleteFieldInput,
         deleteFieldOutput
         
        

 } from "./model"

 const TAGS = ["FormField"]
 const getPath  = generatePath("/form-field")

 export const formFieldRouter= router({
    createField : authenticatedProcedure
                    .meta({
                        openapi:{
                            method:"POST",
                            tags:TAGS,
                            path:getPath("/createField"),
                            protect: true

                        }
                    })
                    .input(createFieldInputModel)
                    .output(createFieldOutputModel)
                    .mutation(
                        async ({input}) => {
                            
                                const {placeholder,label,description ,isRequired,formId,type} = input

                                const result = await formFieldService.createFormField({
                                    label,
                                    
                                    description,
                                    isRequired,
                                    placeholder,
                                    formId,
                                    type,
                                    
                                })

                            return result
                        
                    }),

                 getFields  : authenticatedProcedure
                    .meta({
                        openapi:{
                            method:"GET",
                            tags:TAGS,
                            path: getPath("/getFields"),
                            protect:true
                        }
                    })
                    .input(getFieldsInputModel)
                    .output(getFieldsOutputModel)
                    .query(
                        async ({input}) => {
                            const {formId} = input
                            const result = await formFieldService.getFormField(formId)

                            return result
                        }
                    ),

                    updateField: authenticatedProcedure
  .meta({
    openapi: {
      method: "PATCH",
      tags: TAGS,
      path: getPath("/updateField"),
      protect: true,
    },
  })
  .input(updateFieldInput)
  .output(updateFieldOutput)
  .mutation(async ({ input, ctx }) => {
    const result = await formFieldService.updateFormField(input, ctx.user.id);

    if (!result) throw new Error("Failed to update form field");

    return {
      ...result,
      // ensure non-nullable fields expected by the output model
      formId: result.formId ?? (input as any).formId ?? "",
      createdAt: result.createdAt ?? new Date(),
      updatedAt: result.updatedAt ?? new Date(),
    };
  }),


deleteField: authenticatedProcedure
  .meta({
    openapi: {
      method: "DELETE",
      path: getPath("/deleteField"),
      tags: TAGS,
    },
  })
  .input(deleteFieldInput)
  .output(deleteFieldOutput)
  .mutation(async ({ input, ctx }) => {
    return await formFieldService.deleteFormField(
      input,
      ctx.user?.id
    );
  }),
 })

 