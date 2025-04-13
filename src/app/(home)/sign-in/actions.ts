'use server'

import {signIn} from "@/auth"



export const GoogleLogin = async (redirectUrl : any) => {
    await signIn("google", { redirectTo: redirectUrl ? redirectUrl : "/" });
}



