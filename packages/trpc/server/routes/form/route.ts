import {authenticatedProcedure ,publicProcedure , router} from "../../trpc"
import { formService } from "../../services";
import { generatePath } from "../../utils/path-generator"

import { createFormInputModel ,
  createFormOutputModel, 
  listFormInputModel, 
  listFormOutputModel,
  getFormWithFieldInputModel,
  getFormWithFieldOutputModel, 
  updateFormInput,
  updateFormOutput,
  deleteFormInput,
  deleteFormOutput,
  updateformStatusInput,
  updateFormStatusOutput} from "./model"

const TAGS = ["Form"]
const getPath = generatePath("/form")



export const formRouter = router({
    createForm : authenticatedProcedure 
                    .meta({
                        openapi:{
                            method :"POST",
                            tags :TAGS,
                            path : getPath("/createForm"),
                            protect : true
                        }
                    })
                    .input(createFormInputModel)
                    .output(createFormOutputModel)
                    .mutation(async ({ input, ctx }) => {
  if (!ctx.user?.id) {
    throw new Error( "User is not authenticated" );
  }

  const { title, description } = input;

  const { id } = await formService.createForm({
    title,
    description,
    createdBy: ctx.user.id,
  });

  return { id };
}),

      listForms : authenticatedProcedure
          .meta({
            openapi:{
              method: "GET",
              tags : TAGS,
              path: getPath("/listForm"),
              protect : true

            }
          })
          .input(listFormInputModel)
          .output(listFormOutputModel)
          .query(
            async ({ctx}) => {

              const formx = await formService.listFormByUserId({userId :ctx.user.id})

              const form = formx.forms
              return form
            }

          ),

        getFormWithFields : publicProcedure
            .meta({
              openapi:{
                method:"GET",
                path: getPath("/getForm"),
                tags : TAGS
              }
            })
            .input(getFormWithFieldInputModel)
            .output(getFormWithFieldOutputModel)
            .query(
              async ({input}) => {
                const {id} = input
                const form = await formService.getFormWithFields(id)

                 return form
              }
             
            ),

      
          updateForms : authenticatedProcedure
              .meta({
                openapi:{
                  method : "PATCH",
                  path: getPath("/updateForm"),
                  tags : TAGS
                }
              })
              .input(updateFormInput)
              .output(updateFormOutput)
              .mutation(
                async (
                  {input ,ctx}
                ) => {
                  const result = await formService.updateForms(input,ctx.user.id)

                  if(!result){
                    throw new Error ("failed to update form")
                  }

                  return result
                }
              ),

        
      deleteForms: authenticatedProcedure
  .meta({
    openapi: {
      method: "DELETE",
      path: getPath("/deleteForm"),
      tags: TAGS,
    },
  })
  .input(deleteFormInput)
  .output(deleteFormOutput)
  .mutation(({ input, ctx }) => {
    return formService.deleteForms(
      input,
      ctx.user.id
    );
  }),

  updateFormStatus : authenticatedProcedure
    .meta({
      openapi:{
        method : "PATCH",
        path : getPath("/updateStatus"),
        tags : TAGS,
      },
    })
    .input(updateformStatusInput)
    .output(updateFormStatusOutput)
    .mutation(async ({ input, ctx }) => {
  const result = await formService.updateFormStatus(
    input,
    ctx.user.id
  );

  console.log("STATUS RESULT:", result);

  return result;
})
   
  

          
})