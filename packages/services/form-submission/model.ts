
import z from "zod"

export const submissionValue=  z.object({
    fieldId : z.uuid().describe("uuid of the form field"),
    value : z.string().describe("submitted value as string")
})

export const createSubmissionInput = z.object({
    formId : z.uuid().describe("UUID of the form"),
    values : z.array(submissionValue).describe("array of field/value pairs")
})

export const createSubmissionOutput = z.object({
    id : z.string().describe("id of the created submission"),
    createdAt : z.string().nullable().describe("timestamp created")
})

export type CreateSubmissionInputType = z.infer<typeof createSubmissionInput>
export type CreateSubmissionOutputType = z.infer<typeof createSubmissionOutput>