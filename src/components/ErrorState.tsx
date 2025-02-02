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
      <AlertDialogContent>
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
            <Button variant="link">Return &rarr;</Button>
          </LoadingLink>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    )
}

export default ErrorState
