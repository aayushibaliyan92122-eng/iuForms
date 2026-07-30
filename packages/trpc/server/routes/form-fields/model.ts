import {z} from "zod"
0


export const fieldTypeEnum = z.enum(["TEXT" ,"EMAIL" , "PASSWORD" , "NUMBER" , "YES_NO"])

export const createFieldInputModel = z.object({
    label:z.string().max(100).describe("display label for the field"),
    type: fieldTypeEnum.describe("type of the field"),
    formId: z.uuid().describe("ID of the form the field belongs to"),
    description: z.string().max(1000).optional().describe("HELPER text shown in the field"),
    placeholder:z.string().optional().describe("placeholder text for the field"),
    isRequired : z.boolean().optional().describe("whether the field is required or not")
})

export const createFieldOutputModel = z.object({
    labelKey : z.string().describe("Immutable slug key for the field label"),
    id: z.string().describe("ID of the created field "),
    index : z.string().describe("index string before ordering")
})

export type CreateFieldInputModelType = z.infer<typeof createFieldInputModel>
export type CreateFieldOutputModelType = z.infer< typeof createFieldOutputModel>


export const getFieldsInputModel = z.object({
    formId :z.uuid().describe("UUID of the form to fetch fields for")
})

export const fieldsOutputModel =z.object({
    id : z.string(),
    formId : z.uuid().nullable(),
    description : z.string().nullable(),
    placeholder: z.string().nullable(),
    type : fieldTypeEnum,
    isRequired : z.boolean(),
    index: z.string(),
    label : z.string(),
    labelKey : z.string(),
    createdAt:z.string().nullable(),
    updatedAt:z.string().nullable()
})

export const getFieldsOutputModel = z.array(fieldsOutputModel);

export type GetFieldsInputModelType = z.infer<typeof getFieldsInputModel>
export type GetFieldsOutputModelType = z.infer<typeof getFieldsOutputModel>