import React from 'react'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog";
  import { Link, OctagonAlert } from 'lucide-react';
  import { Button } from '@/components/ui/button';
  import { useTranslations } from 'next-intl';

const ErrorState = () =>{
  const t = useTranslations('CommonComponents');

    return (
      <AlertDialog open={true}>
      <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
      <AlertDialogHeader className="flex flex-col items-center">
          <div className="text-red-500 mb-2">
            <OctagonAlert/>
          </div>
          <AlertDialogTitle className="text-xl font-semibold text-center text-red-500">
            {t('errorTitle')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('errorDescription')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Link className="text-right" href="/">
            <Button className='bg-red-500 hover:bg-red-500 text-white' size={"sm"} variant="default">{t('return')}</Button>
          </Link>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    )
}

export default ErrorState
