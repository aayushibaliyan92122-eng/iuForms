
import z from "zod"

const fieldTypeEnum = z.enum([  "NUMBER",
    "YES_NO",
    "TEXT",
    "EMAIL",
    "PASSWORD"])


export const createFieldInput = z.object({
    label : z.string().max(50).describe("Display LABEL for the form field"),
    type : fieldTypeEnum.describe('type of the field'),
    formId : z.uuid().describe("UUID of the form this field belongs to"),
    description : z.string().optional().describe("Helper text below the field"),
    placeholder:z.string().optional().describe("placeholder text for the form-field"),
    isRequired : z.boolean().optional().describe("whether the field is required or not")
})

export type CreateFieldInputType = z.infer<typeof createFieldInput>



export const getFieldInput = z.object({
    formId : z.uuid().describe("UUID of the form this field belongs to")
})

export type GetFieldInputType = z.infer<typeof getFieldInput>