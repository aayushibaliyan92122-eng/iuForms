
import z from "zod"

export const fieldTypeEnum = z.enum([  "NUMBER",
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


export const updateFieldInput = z.object({
  fieldId: z.uuid().describe("UUID of the field to update"),

  label: z.string().min(1).max(50).optional().describe("Updated display label for the form field"),

  description: z.string().optional().describe("Updated helper text for the field"),

  placeholder: z.string().optional().describe("Updated placeholder text for the field"),

  type: fieldTypeEnum.optional().describe("Updated type of the field"),

  isRequired: z.boolean().optional().describe("Whether the field is required"),
}).refine(
  (data)=>
    data.label !== undefined ||
    data.placeholder !== undefined ||
    data.type !== undefined ||
    data.description !== undefined ||
    data.isRequired !== undefined ,
    {
      message:"at least one field must be provided for update."
    }
)

export type UpdateFieldInputType = z.infer<typeof updateFieldInput>;


export const deleteFieldInput = z.object({
  fieldId : z.uuid().describe("uuid of the field to delete")
})

export type DeleteFieldInputType = z.infer<typeof deleteFieldInput>