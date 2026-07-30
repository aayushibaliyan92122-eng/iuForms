//isme hamra procedure likha jayega 
//2 chiz oiomport ik rpocedure ik router  from trpc.ts bcs hme ye hi chahiye route bnane mai
//jo hme input/output liye chahiye vo hm model.ts se lege
//service liye hme db se servicces import krege
//wait

import { authenticatedProcedure, publicProcedure,router} from "../../trpc"

import {
    createUserWithEmailAndPasswordInputModel,
    createUserWithEmailAndPasswordOutputModel,
    getLoggedInUserInfoInputModel,
    getLoggedInUserInfoOutputModel,
    signInUserWithEmailAndPasswordInputModel,
    signInUserWithEmailAndPasswordOutputModel
}from "./model"

import { userService } from "../../services"

import {generatePath} from "../../utils/path-generator"
import { signInUserWithEmailAndPassword } from "../../../../services/user/model"
const getPath =  generatePath("/authentication")
const TAGS = ["Authentication"]


export const authRouter = router(
    
    
    {
        createUserWithEmailAndPassword : publicProcedure
        .meta({
            openapi:{
                path: "/createUserWithEmailAndPassword",
                tags:TAGS,
                method:"POST"

            }
        })
        .input(createUserWithEmailAndPasswordInputModel)
        .output(createUserWithEmailAndPasswordOutputModel)
        .mutation(
         async({input , ctx})=>{
             console.log("CREATE USER PROCEDURE RUNNING");
            const {email , fullName , password} = input

            const {id} = await userService.createUserWithEmailAndPassword({
                email,
                password,
                fullName
            })


            return{id}
            
         } ),

         signInUserWithEmailAndPassword : publicProcedure
                .meta({
                    openapi:{
                        method:"POST",
                        path: getPath("/signInUserWithEmailAndPassword"),
                        tags:TAGS
                    }
                })
                .input(signInUserWithEmailAndPasswordInputModel)
                .output(signInUserWithEmailAndPasswordOutputModel)
                .mutation(async({input , ctx})=>{
                    console.log("SIGNIN USER PROCEDURE RUNNING");
                    const {email,password} = input

                    const {token,id} = await userService.signInUserWithEmailAndPassword({email,password})

                    // Log the signed-in user id to the server terminal
                    console.log("SIGNED IN USER ID:", id);

                   ctx.setCookie("token", token, {
                         httpOnly: true,
                         secure: false,
                         sameSite: "lax",
                         maxAge: 30 * 24 * 60 * 60 * 1000,
});
                    return { id }
                }),

        getLoggedInUserInfo : authenticatedProcedure
                .meta({
                    openapi:{
                        method:"GET",
                        tags:TAGS,
                        path: getPath("/getLoggedInUserInfo"),

                    }
                })
                .input(getLoggedInUserInfoInputModel)
                .output(getLoggedInUserInfoOutputModel)
                .query(
                    async ({ctx}) => {

                        const {id,fullName, email } = await userService.getLoggedInUserInfo(ctx.user.id)

                        
                        return{
                            id,
                           fullName,
                           email
                        }
                   
                })
    })

