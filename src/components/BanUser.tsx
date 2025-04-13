/* eslint-disable react/no-unescaped-entities */
'use client';

import { User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Label } from './ui/label';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Loader } from 'lucide-react';
import { getUser } from '@/actions/actions';


const BanUser= ({user}:{user : User}) => {
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
        
      if (user?.isUserBanned) {
        const timeout = setTimeout(() => {
          router.push('/api/auth/logout');
        }, 5000);
  
        return () => clearTimeout(timeout); // Cleanup timeout on unmount
      }
    };
  
    fetchUser();
  }); // Make sure to rerun this effect if the router changes
  

  return (
    <>
    {user && user.isUserBanned && (

  <AlertDialog open={true} >
      <AlertDialogContent className="rounded-xl max-w-[80%] sm:max-w-[60%] md:max-w-[40%] xl:max-w-[30%]">
      <AlertDialogHeader className="flex flex-col items-center">
      <AlertDialogTitle className="font-bold text-center">
      <Label className='text-red-500 text-xl'>You've been banned !</Label>
      </AlertDialogTitle>
      <AlertDialogDescription className="flex flex-col items-center">
      You'll be logged out from your account. Contact us if an error has occurred or if you need assistance.      
      </AlertDialogDescription>
    </AlertDialogHeader>
  </AlertDialogContent>
</AlertDialog>
)}

</>

)
};

export default BanUser;
