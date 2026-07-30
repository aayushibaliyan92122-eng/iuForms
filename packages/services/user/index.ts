import { db, eq } from "@repo/database";
import bcrypt from "bcryptjs";

import { userTable } from "@repo/database/models/user";

import {
  CreateUserWithEmailAndPasswordType,
  createUserWithEmailAndPassword,
  generateUserTokenPayload,
  GenerateUserTokenPayloadType,
  signInUserWithEmailAndPassword,
  SignInUserWithEmailAndPasswordType
} from "./model";
import * as JWT from "jsonwebtoken";
import { env } from "../env";



export default class UserService {

  private async getUserByEmail(email: string) {
    const result = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email));

    if (result.length === 0) {
      return null;
    }

    return result[0];
  }

  private async generateUserToken(payload:GenerateUserTokenPayloadType){
    const {id} = await generateUserTokenPayload.parseAsync(payload)
    const token = JWT.sign({id}, env.JWT_SECRET)
    return {token}
  }

  public async createUserWithEmailAndPassword(
    payload: CreateUserWithEmailAndPasswordType,
  ) {
    const { fullName, email, password } =
      await createUserWithEmailAndPassword.parseAsync(payload);

    const existingUser = await this.getUserByEmail(email);

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await db
      .insert(userTable)
      .values({
        fullName,
        email,
        passwordHash,
      })
      .returning({
        id: userTable.id,
      });

    return result[0]!;
  }

  public async signInUserWithEmailAndPassword(payload : SignInUserWithEmailAndPasswordType){
      const {email, password} = await signInUserWithEmailAndPassword.parseAsync(payload)


      const existingUser = await this.getUserByEmail(email)
        if(!existingUser){
            throw new Error("user with this email not exist")
        }

      if(!existingUser.passwordHash){
          throw new Error("this user is not authenticated")
      }


      const isValid = await bcrypt.compare(password,existingUser.passwordHash)
      if(!isValid){"invalid credentials"}

      const {token} = await this.generateUserToken({id : existingUser.id})


      
      return{
        id:existingUser.id,
        token
      }
      
  }

  public async verifyAndDecodeUserToken(token:string){
    try {
      const result = JWT.verify(token, env.JWT_SECRET) as GenerateUserTokenPayloadType
      return  result

    } catch (err) {
      throw new Error("invaild token")
    }
  }
  
  public async getLoggedInUserInfo(id:string){
        const user = await  db
                          .select({id: userTable.id , fullName : userTable.fullName ,email: userTable.email})
                          .from(userTable)
                          .where(eq( userTable.id , id))

      if(!user || user.length === 0){
        throw new Error("user with this id does not exist.")
      }

     
      return user[0]!
  }
}