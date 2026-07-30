import z  from "zod"

export const submissionValueModel = z.object({
    fieldId : z.uuid(),
    value : z.string()
})

export const createSubmissionInputModel = z.object({
    formId : z.uuid(),
    values : z.array(submissionValueModel)
})

export const createSubmissionOutputModel = z.object({
    id : z.string(),
    createdAt : z.string().nullable()
})

export const getSubmissionInputModel= z.object({
    formId : z.uuid().describe("id of the form")
})

export const getSubmissionOutputModel = z.array(
    z.object({
        id : z.string(),
        formId : z.uuid().nullable(),
        values : z.array(
            z.object({
                fieldId : z.uuid(),
                value: z.string()
            })

        ),
        createdAt  : z.string().nullable(),
        updatedAt : z.string().nullable()
  })
)

export type CreateSubmissionInputModelType = z.infer<typeof createSubmissionInputModel>
export type CreateSubmissionOutputModelType  = z.infer<typeof createSubmissionOutputModel>
export type GetSubmissionInputModelType = z.infer<typeof getSubmissionInputModel>
export type GetSubmissionOutputModelType = z.infer<typeof getSubmissionOutputModel>