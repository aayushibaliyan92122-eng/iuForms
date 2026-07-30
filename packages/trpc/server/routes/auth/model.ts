// hm ky input dege ky output degen jo ki hm procedure mai use krege and then route.ts mai

import z from "zod"

export const createUserWithEmailAndPasswordInputModel= z.object(
    {
            fullName : z.string().describe("user's full name here"),
            email : z.string().describe("user's email here"),
            password:z.string().describe("password of the user")
        }
)

export const createUserWithEmailAndPasswordOutputModel = z.object(
    {
        id: z.string().describe("ID of the user")
    }
)

export const signInUserWithEmailAndPasswordInputModel = z.object({
       email : z.string().describe("email id of the user"),
       password : z.string().describe("password of the user")
   
})

export const signInUserWithEmailAndPasswordOutputModel = z.object({
    id: z.string().describe("ID of the user")
})

export const getLoggedInUserInfoInputModel = z.undefined()
export const getLoggedInUserInfoOutputModel = z.object({
    id: z.string().describe("ID of the user"),
    fullName: z.string().describe("Name of the user"),
    email : z.string().describe("email id of the user")
})