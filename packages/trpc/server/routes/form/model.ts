import {z} from "zod"
import { fieldsOutputModel } from "../form-fields/model";

export const createFormInputModel = z.object({
     title: z.string().max(50).describe("Title of the form"),
    description: z.string().max(300).optional().describe("Description of the form"),
})

export const createFormOutputModel = z.object({
    id : z.string().describe("ID of the created form"),
})


export const listFormInputModel = z.undefined()
export const listFormOutputModel = z.array(
   z.object({ 
    id: z.string().describe("ID of the form"),
    title: z.string().describe("title of the form"),
    description : z.string().nullable().optional().describe("description of the user"),
    createdAt : z.date().nullable().describe("Creation timestamp"),
    updatedAt: z.date().nullable().describe("last updated timestamp")
})
)

export const getFormWithFieldInputModel = z.object({
    id: z.uuid().describe("uuid of the form to fetch")

})

export const getFormWithFieldOutputModel = z.object({
    id :z.string(),
    title : z.string(),
    description  :z.string().nullable(),
    createdAt : z.string().nullable(),
    updatedAt : z.string().nullable(),
    fields : z.array(fieldsOutputModel)
})