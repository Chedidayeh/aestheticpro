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
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getTranslations } from 'next-intl/server';

const Page = async () => {
  const t = await getTranslations('CreateAffiliateAccountPage');

  const user =await getUser()
  const platform = await getPlatformForTheWebsite();

  
  if (!user) {
    return (
  <AlertDialog open={true}>
  <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
  <AlertDialogHeader>
        <AlertDialogTitle className="text-lg text-center font-bold tracking-tight">
        {t('signInToContinue')}
        </AlertDialogTitle>
        <AlertDialogDescription className="text-sm text-center py-2">
          {t('pleaseLoginRedirect')}
        </AlertDialogDescription>
      </AlertDialogHeader>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 w-full">
        <Link href="/" className="w-full sm:w-auto">
          <Button size={"sm"} variant={"outline"} className="w-full sm:w-auto">
            &larr; {t('returnHome')}
          </Button>
        </Link>
        <RedirectToCreateAffiliateAccount className="text-white w-full sm:w-auto" href="/auth/sign-in">
          {t('login')} &rarr;
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
          {t('alreadyAffiliate')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('redirectingToDashboard')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 w-full mt-2">
          <Link href="/" className="w-full sm:w-auto">
            <Button size={"sm"} variant={"outline"} className="w-full sm:w-auto">
              &larr; {t('returnHome')}
            </Button>
          </Link>
          <Link className="w-full sm:w-auto text-right" href="/affiliateDashboard">
            <Button className='w-full sm:w-auto bg-blue-500 hover:bg-blue-500 text-white' size={"sm"} variant="default">{t('goToDashboard')} &rarr;</Button>
          </Link>
        </div>
      </AlertDialogContent>
    </AlertDialog>
)    
  }

  if(platform?.closeAffiliateProgram) {
    return (
            <AlertDialog open={true}>
            <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
            <AlertDialogHeader className="flex flex-col items-center">
                <div className="text-blue-500 mb-2">
                  <OctagonAlert/>
                </div>
                <AlertDialogTitle className="text-lg font-semibold text-center text-blue-500">
                  {t('affiliateDisabled')}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t('returnHomePrompt')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 w-full mt-2">
                <Link className="w-full sm:w-auto text-right" href="/">
                  <Button className='w-full sm:w-auto bg-blue-500 hover:bg-blue-500 text-white' size={"sm"} variant="default">&larr; {t('return')}</Button>
                </Link>
              </div>
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
