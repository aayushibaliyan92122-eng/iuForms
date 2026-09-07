import { authenticatedProcedure ,publicProcedure,router } from "../../trpc";
import { formSubmissionService } from "../../services";

import {
    createSubmissionInputModel,
    createSubmissionOutputModel,
    
    getSubmissionInputModel,
    getSubmissionOutputModel,
  
} from "./model"


import { generatePath } from "../../utils/path-generator";

const TAGS = ["FormSubmission"]
const getPath = generatePath("/form-submission")

export const formSubmissionRouter = router(
   { 
    createSubmission : publicProcedure.
            meta({
                openapi:{
                    method : "POST",
                    tags:TAGS,
                    path:getPath("/createSubmission")
                }
            })
            .input(createSubmissionInputModel)
            .output(createSubmissionOutputModel)
            .mutation(async ({input}) => {
                
                const result = await formSubmissionService.createSubmission(input as any)
                return result
            }),

             getSubmission : authenticatedProcedure
                                .meta({
                                    openapi:{
                                        method:"GET",
                                        path: getPath("/getSubmission"),
                                        tags : TAGS
                                        
                                    }
                                })
                                .input(getSubmissionInputModel)
                                .output(getSubmissionOutputModel)
                                .query(async ({input , ctx}) => {
                                    const {formId } = input
                                    const result = await formSubmissionService.getSubmissionByFormId(formId , ctx.user.id)
                                    return result
                                })
    }
   
)

export default formSubmissionRouter