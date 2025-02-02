/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
'use client'
import NextImage from 'next/image'

import * as React from "react"

import { Button, buttonVariants } from "@/components/ui/button"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import * as z from "zod"

import { FormError } from "@/components/form-error"
import { FormSuccess } from "@/components/form-success"
import { ArrowRight, Eye, EyeOff, Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { User } from "@prisma/client"
import LoadingLink from '@/components/LoadingLink'

const passwordSchema = z.string().min(8,{
  message: 'At least 8 characters required !'
})



const ResetPassView = ({status , user} : {status : string , user? : User}) => {
  const router = useRouter()
  const { toast } = useToast()
  const [passwordError, setpasswordError] = useState("");
  const [passwordsuccess, setpasswordsuccess] = useState("");
  const [isLoading, setisLoading] = useState(false);

  const [newPassword, setNewPassword] = useState(""); // State for storing new password
  const [showPassword, setShowPassword] = useState(false); // State for showing/hiding password

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // const handleSubmit = async () => {
  //   try {
  //     passwordSchema.parse(newPassword);
  //     setpasswordError("");
  //     setisLoading(true)
  //     const res = await updatePass(user?.id!,newPassword)
  //     if(res){
  //       setpasswordsuccess("Your password has been updated successfully !");
  //       toast({
  //         title: 'Password updated',
  //         description: 'Your password has been updated successfully! Try to sign In again',
  //         variant: 'default',
  //       }); 
  //       router.push("/auth/sign-in")
  //     }
  //     else{      
  //       setisLoading(false)
  //       setpasswordError("Something went wrong !")
  //     }


  //   } catch (e) {
  //     if (e instanceof z.ZodError) {
  //       setpasswordError(e.errors[0].message);
  //       return
  //     }
  //     setisLoading(false)
  //     console.log(e)
  //   }
  // };

  return (
    <>
      <div className='container relative flex py-10 flex-col items-center justify-center lg:px-0'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
          <div className='flex flex-col items-center space-y-2 text-center'>
            <NextImage src="/resetPasswordIcon.png" alt='resetPasswordIcon' className='h-20 w-20' />
            {status === "success" && (

              <>
            <h1 className='text-2xl font-semibold tracking-tight'>
                Reset Your Password !
            </h1>

            <div className="flex flex-col items-center justify-center">
            <div className="mb-2 mt-10">
                <Label>User Email: <span className="text-blue-700">{user?.email}</span></Label>
              </div>
              <div className="mb-2">
                <Label>New Password : </Label>
              </div>
              <div>
              <div className="relative w-full">
              <Input
                placeholder="********"
                type={showPassword ? "text" : "password"} // Toggle input type
                value={newPassword}
                onChange={handlePasswordChange}
                className="pr-10" // Add padding to avoid overlap with the button
              />
              {/* <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Eye className="h-5 w-5 text-muted-foreground" />
                )}
              </button> */}
            </div>

              </div>
              <div className="mt-2">
              <FormError message={passwordError}  />
              <FormSuccess message={passwordsuccess}  />
              </div>

              <Button disabled={isLoading}  className="mt-2">
              {isLoading ? (<Loader className="animate-spin"/>) 
              : ("Reset Password")}               
                </Button>
            </div>

              </>
                )}

            {status === "error" && (

            <>
            <h1 className='text-2xl font-semibold tracking-tight'>
              Please make sure to check your emails !
            </h1>
            </>
              )}

              {status === "noUser" && (

              <>
              <h1 className='text-2xl font-semibold tracking-tight'>
                No User found !
              </h1>
              <LoadingLink
              className={buttonVariants({
                variant: 'link',
                className: 'gap-1.5',
              })}
              href='/auth/sign-up'>
                Try to Sign-Up
              <ArrowRight className='h-4 w-4' />
            </LoadingLink>
              </>
                )}
          </div>
        </div>
      </div>
    </>
  )
}

export default ResetPassView