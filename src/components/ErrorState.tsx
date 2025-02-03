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
import LoadingLink from './LoadingLink';

const ErrorState = () =>{

    return (
      <AlertDialog open={true}>
      <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
      <AlertDialogHeader className="flex flex-col items-center">
          <div className="text-red-500 mb-2">
            <OctagonAlert/>
          </div>
          <AlertDialogTitle className="text-xl font-semibold text-center text-red-500">
            Something went wrong!
          </AlertDialogTitle>
          <AlertDialogDescription>
            We encountered an error while loading the data. Please try
            again later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <LoadingLink className="text-right" href="/">
            <Button size={"sm"} variant="default">Return &rarr;</Button>
          </LoadingLink>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    )
}

export default ErrorState
