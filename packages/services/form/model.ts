import {uuid, z} from "zod"

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