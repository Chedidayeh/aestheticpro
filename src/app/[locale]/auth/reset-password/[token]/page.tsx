'use server'

import * as React from "react"
import ResetPassView from "./ResetPassView"
import { getUserByresetToken } from "@/userData/user"


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
  const user = await getUserByresetToken(token)

  if(!user) {
    status="noUser"
  }
 
      
  return (
    <>

    <ResetPassView status={status} user={user!} />
      
    </>
  )
}

export default Page