import { initTRPC, TRPCError } from "@trpc/server";
import { OpenApiMeta } from "trpc-to-openapi";
import { userService } from "./services";
import { createContext } from "./context";

export const tRPCContext = initTRPC
  .meta<OpenApiMeta>()
  .context<typeof createContext>()
  .create({});

export const router = tRPCContext.router;

export const publicProcedure = tRPCContext.procedure;

export const authenticatedProcedure =
  tRPCContext.procedure.use(async (options) => {
    const { ctx } = options;

    const userToken = ctx.getCookie("token");

    console.log("TOKEN EXISTS:", !!userToken);

    if (!userToken) {
      throw new Error("User is not logged in");
    }

    const decoded =
      await userService.verifyAndDecodeUserToken(userToken);

    console.log("DECODED TOKEN:", decoded);

    const { id } = decoded;

    console.log("AUTH USER ID:", id);

    return options.next({
      ctx: {
        ...ctx,
        user: { id },
      },
    });
  });


