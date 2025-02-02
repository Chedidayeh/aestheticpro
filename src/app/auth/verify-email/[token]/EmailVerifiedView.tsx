/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
'use client'
import NextImage from 'next/image'

import * as React from "react"

import { buttonVariants } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import LoadingLink from '@/components/LoadingLink'
const EmailVerifiedView = ({status} : {status : string}) => {
  

  return (
    <>
      <div className='container relative flex py-40 flex-col items-center justify-center lg:px-0'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
          <div className='flex flex-col items-center space-y-2 text-center'>
            <NextImage alt='email-verification-icon' src="/email-verification-icon.png" className='h-20 w-20' />
            {status === "success" && (
              <>
            <h1 className='text-2xl font-semibold tracking-tight'>
                Email successfully verified !
            </h1>

            <LoadingLink
              className={buttonVariants({
                variant: 'link',
                className: 'gap-1.5',
              })}
              href='/auth/sign-in'>
                Try to Sign-in
              <ArrowRight className='h-4 w-4' />
            </LoadingLink>

              </>
                )}

            {status === "error" && (

            <>
            <h1 className='text-2xl font-semibold tracking-tight'>
              Please make sure to verify you email !
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

export default EmailVerifiedView