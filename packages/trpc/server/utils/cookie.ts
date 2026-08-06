import type {Request ,Response ,CookieOptions } from "express";

export function setCookie(res: Response, name:string , value:string , opts : CookieOptions){
        res.cookie(name, value ,opts)
}

export function getCookie(req:Request , name:string):string | undefined{
    return req.cookies?.[name]
}

export function clearCookie(res: Response, name:string){
    // ensure the clear uses the same attributes as when the cookie was set
    res.clearCookie(name, { httpOnly: true, secure: false, sameSite: 'lax', path: '/' })
}