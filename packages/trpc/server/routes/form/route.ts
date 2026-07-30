import {authenticatedProcedure ,publicProcedure , router} from "../../trpc"
import { formService } from "../../services";
import { generatePath } from "../../utils/path-generator"

import { createFormInputModel ,
  createFormOutputModel, 
  listFormInputModel, 
  listFormOutputModel,
  getFormWithFieldInputModel,
  getFormWithFieldOutputModel } from "./model"

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
             
            )


          
})