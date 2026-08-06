import z from "zod";

export const getStatsInputModel = z.undefined();
export const getStatsOutputModel = z.object({
  totalForms: z.number(),
  totalResponses: z.number(),
  totalFields: z.number(),
});

export const listFormsWithCountsInputModel = z.undefined();
export const listFormsWithCountsOutputModel = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable().optional(),
    createdAt: z.string().nullable(),
    updatedAt: z.string().nullable(),
    responseCount: z.number(),
    fieldCount: z.number(),
  }),
);
