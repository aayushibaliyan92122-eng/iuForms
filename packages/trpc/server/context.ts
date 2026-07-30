
import type {CookieOptions} from "express"
import type {CreateExpressContextOptions} from "@trpc/server/adapters/express"
import { setCookie as setCookieUtil ,
        getCookie as getCookieUtils,
        clearCookie as clearCookieUtil
 } from "./utils/cookie"

 export interface ContextUser{
    id: string;
 }

export interface TRPCContext{
    setCookie : (name: string, value: string , opts: CookieOptions) => void
    getCookie :(name : string) => string | undefined;
    clearCookie : (name:string) => void;

    user? : ContextUser
}

export async function createContext({req,res}: CreateExpressContextOptions) {
    console.log("🔥 CREATE CONTEXT RUNNING");
    const ctx : TRPCContext= {

        setCookie( name :string, value:string, opts: CookieOptions) {
            return setCookieUtil(res,name,value,opts)
        },
        getCookie(name:string) {
            return getCookieUtils(req,name)
        },
        clearCookie(name:string){
            return clearCookieUtil(res ,name)
        }
        ,
        user:undefined,
    }

    console.log(ctx)
    return ctx
}







export type Context = Awaited<ReturnType<typeof createContext>>;
