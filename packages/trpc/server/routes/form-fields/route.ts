import {authenticatedProcedure,router,publicProcedure} from "../../trpc"
import { formFieldService } from "../../services"
import { generatePath } from "../../utils/path-generator"

import {
         createFieldOutputModel,
         createFieldInputModel,
         getFieldsInputModel,
         getFieldsOutputModel
        

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
                    )
 })

 