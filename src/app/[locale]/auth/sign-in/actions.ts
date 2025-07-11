'use server'

import * as z from "zod"
import { LoginSchema } from "../schemas"
import {signIn} from "@/auth"
import { AuthError } from "next-auth"
import { db } from "@/db"
import { checkGoogleLoggedInUser, getUserByEmail } from "@/userData/user"
import { User } from "@prisma/client"
import crypto from 'crypto';
import { sendResetPassEmail } from "@/lib/mailer"



export const GoogleLogin = async (redirectUrl : any) => {
    await signIn("google", { redirectTo: redirectUrl ? redirectUrl : "/" });
}



