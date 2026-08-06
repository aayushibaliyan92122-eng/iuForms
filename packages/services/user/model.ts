//isme hm scehma likhege means hme kis type ka input len ausse hmvalidate kr paye user se .

import {uuid, z} from "zod"

export const createUserWithEmailAndPassword = z.object(
    
    {
        fullName : z.string().describe("user's full name here"),
        email : z.string().describe("user's email here"),
        password:z.string().describe("password of the user")
    }
)


export type CreateUserWithEmailAndPasswordType = z.infer<typeof createUserWithEmailAndPassword>;


export const generateUserTokenPayload = z.object({
  id : z.string().describe("id of the user")
})

export type GenerateUserTokenPayloadType = z.infer< typeof generateUserTokenPayload>;


export const signInUserWithEmailAndPassword = z.object(
    {
          email : z.string().describe("email id of the user"),
    password : z.string().describe("password of the user")

    }
)


export type SignInUserWithEmailAndPasswordType = z.infer< typeof signInUserWithEmailAndPassword>

export const logoutUser = z.object({
    userId : z.string().describe("the id of the user signIn")
})

export type LogoutUserType = z.infer<typeof logoutUser>