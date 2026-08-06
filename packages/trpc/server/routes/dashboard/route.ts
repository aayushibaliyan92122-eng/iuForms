import { authenticatedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { formService } from "../../services";
import {
  getStatsInputModel,
  getStatsOutputModel,
  listFormsWithCountsInputModel,
  listFormsWithCountsOutputModel,
} from "./model";

const TAGS = ["Dashboard"];
const getPath = generatePath("/dashboard");

export const dashboardRouter = router({
  getStats: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        tags: TAGS,
        path: getPath("/getStats"),
        protect: true,
      },
    })
    .input(getStatsInputModel)
    .output(getStatsOutputModel)
    .query(async ({ ctx }) => {
      const stats = await formService.getDashboardStats(ctx.user.id);
      return stats;
    }),

  listRecentForms: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        tags: TAGS,
        path: getPath("/listRecentForms"),
        protect: true,
      },
    })
    .input(listFormsWithCountsInputModel)
    .output(listFormsWithCountsOutputModel)
    .query(async ({ ctx }) => {
      const forms = await formService.listFormsWithCountsByUserId(ctx.user.id);
      return forms;
    }),
});
