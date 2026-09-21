
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

export const deleteSubmissionInput = z.object({
    submissionId : z.uuid().describe("uuid of the submission")
})

export type DeleteSubmissionInputType = z.infer<typeof deleteSubmissionInput>

export const deleteSubmissionOutput = z.object({
  id: z.uuid().describe("ID of the deleted submission"),
});


export type DeleteSubmissionOutputType = z.infer<typeof deleteSubmissionOutput>

export type CreateSubmissionInputType = z.infer<typeof createSubmissionInput>
export type CreateSubmissionOutputType = z.infer<typeof createSubmissionOutput>