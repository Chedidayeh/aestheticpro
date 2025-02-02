import {PrismaAdapter} from "@auth/prisma-adapter"
import { db } from "@/db"
import { getUserById } from "./userData/user"
import NextAuth, { type DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"
import { UserType } from "@prisma/client"
import authConfig from "./auth.config"
// Extend the `Session` interface to include `role` and `id`
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserType
      isBanned : Boolean
      isAffiliate : Boolean
    } & DefaultSession["user"];
  }
}

 
declare module "next-auth/jwt" {
  interface JWT {
    role?: UserType
    isBanned : Boolean
    isAffiliate : Boolean
  }
}




export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    async session({ token,session }) {
      if(token.sub && session.user){
        session.user.id = token.sub
      }

      if(token.role && session.user){

        session.user.role = token.role
        session.user.isBanned = token.isBanned
        session.user.isAffiliate = token.isAffiliate
      }


      return session
    },
    async jwt ({token , trigger , session   }) {
      if (trigger === "update" && session.user.role) {
        token.role = session.user.role
      }
      if(!token.sub) return token
      try {
        const existingUser = await getUserById(token.sub);
        if (!existingUser) return token;
    
        token.role = existingUser.userType;
        token.isBanned = existingUser.isUserBanned;
        token.isAffiliate = existingUser.isAffiliate;
      } catch (error) {
        console.error("Error fetching user data:", error);
      }


      return token
    },
  },
  adapter : PrismaAdapter(db),
  session : {strategy : "jwt" , 
  },
  ...authConfig,
})