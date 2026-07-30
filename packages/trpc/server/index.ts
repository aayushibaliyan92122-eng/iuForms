import { router } from "./trpc";
import { authRouter } from "./routes/auth/route";
import {formRouter} from "./routes/form/route"
import { formFieldRouter } from "./routes/form-fields/route";
import { formSubmissionRouter } from "./routes/form-submission/route";

export const serverRouter = router({
  auth: authRouter,
  form : formRouter,
  formField : formFieldRouter,
  formSubmission : formSubmissionRouter
});



export type ServerRouter = typeof serverRouter;

export { createContext } from "./context";