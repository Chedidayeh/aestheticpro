/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import React from "react";
import {
  getPlatformForTheWebsite,
  getUser
} from "@/actions/actions";
import CreateAffiliateAccountView from "./createAffiliateAccountView";
import RedirectToCreateAffiliateAccount from "@/components/RedirectToCreateAffiliateAccount";
import { OctagonAlert } from "lucide-react";
import LoadingLink from "@/components/LoadingLink";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Page = async () => {

  const user =await getUser()
  const platform = await getPlatformForTheWebsite();

  
  if (!user) {
    return (
  <AlertDialog open={true}>
  <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
  <AlertDialogHeader>
        <AlertDialogTitle className="text-lg text-center font-bold tracking-tight">
        Sign In to continue
        </AlertDialogTitle>
        <AlertDialogDescription className="text-sm text-center py-2">
          Please login and{" "}
          <span className="font-medium text-blue-500">
            you'll be redirected to this page!
          </span>
        </AlertDialogDescription>
      </AlertDialogHeader>

      <div className="flex items-center justify-center gap-2">
        <LoadingLink href="/">
        <Button size={"sm"} variant={"outline"} className="">
        &larr; Return Home
          </Button>
          </LoadingLink>
        <RedirectToCreateAffiliateAccount className="text-white" href="/auth/sign-in">
          login &rarr;
        </RedirectToCreateAffiliateAccount>
      </div>
    </AlertDialogContent>
  </AlertDialog>
  )
  }

  if (user?.isAffiliate) {
    return (
      <AlertDialog open={true}>
      <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
      <AlertDialogHeader className="flex flex-col items-center">
          <div className="text-gray-500 mb-2">
            <OctagonAlert/>
          </div>
          <AlertDialogTitle className="text-lg font-semibold text-center ">
          You're already part of our affiliate program          
          </AlertDialogTitle>
          <AlertDialogDescription>
            Redirecting you to your affiliate dashboard.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
        <LoadingLink href="/">
        <Button size={"sm"} variant={"outline"} className="">
        &larr; Return Home
          </Button>
          </LoadingLink>
          <Link className="text-right" href="/affiliateDashboard">
            <Button className='bg-blue-500 hover:bg-blue-500 text-white' size={"sm"} variant="default">Go to dashboard &rarr;</Button>
          </Link>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
)    
  }

  if(platform?.closeAffiliateProgram) {
    return (
            <AlertDialog open={true}>
            <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
            <AlertDialogHeader className="flex flex-col items-center">
                <div className="text-red-500 mb-2">
                  <OctagonAlert/>
                </div>
                <AlertDialogTitle className="text-lg font-semibold text-center text-red-500">
                  Affiliate program is disabled for now !
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Please return to home page
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <Link className="text-right" href="/">
                  <Button className='bg-red-500 hover:bg-red-500 text-white' size={"sm"} variant="default">&larr; Return </Button>
                </Link>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
    )
  }
  

  return (
    <>

    <CreateAffiliateAccountView user={user!} />

    </>
  )
}

export default Page
