'use server'

import * as React from "react"
import EmailVerifiedView from "./EmailVerifiedView"
import { getUserByToken } from "@/userData/user"
import { verifyEmail } from "./actions"


interface PageProps {
  params: {
    token: string
  }
}

const Page = async ({ params }: PageProps) => {
  let status = "success"
  const {token} = params

  if(!token){
    status = "error"
  }
  const user = await getUserByToken(token)

  if(!user) {
    status="noUser"
  }
  else {
    await verifyEmail(user.id)
  }



  


      

  return (
    <>

    <EmailVerifiedView status={status} />
      
    </>
  )
}

export default Page