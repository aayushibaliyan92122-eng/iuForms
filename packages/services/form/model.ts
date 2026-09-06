import {uuid, z} from "zod"


export const updateFormStatusEnum = z.enum(["DRAFT" , "PUBLISHED","CLOSED"])

export const updateformStatusInput = z.object({
    formId : z.uuid().describe("id of the form"),
    status : updateFormStatusEnum.describe("status of the form")
})

export type UpdateFormStatusInputType = z.infer<typeof updateformStatusInput>

export const createFormInput = z.object({
    title : z.string().max(30).describe("title of the form"),
    description: z.string().max(300).describe("description of the form").optional(),
    createdBy :z.uuid("id").describe("ID of the creator")
})

export type CreateFormInputType = z.infer<typeof createFormInput>


export const listFormByUserIdInput = z.object({
   userId : z.uuid().describe("uuid of the user")
})

export type ListFormByUserIdInputType = z.infer<typeof listFormByUserIdInput>


export const updateFormInput = z.object({
     title : z.string().min(1).max(30).describe("title of the form").optional(),
    description: z.string().max(300).describe("description of the form").optional(),
    formId :z.uuid().describe("id of the form to update")
}).refine((data)=>
    data.title !== undefined ||
    data.description !== undefined 
    ,{
        message : "atleast one field must be provided for update."
    }
    
)

export  type UpdateFormInputType = z.infer<typeof updateFormInput>

export const deleteFormInput = z.object({
  formId : z.uuid().describe("uuid of the Form to delete")
})

export type DeleteFormInputType = z.infer<typeof deleteFormInput>

