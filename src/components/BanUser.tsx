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


const BanUser= () => {
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>();

  useEffect(() => {
    const fetchUser = async () => {
      // Fetch user data from an API or other source
      const user = await getUser()
      setUser(user)
      
      // Update the user state (assuming you have a state for this)
  
      if (user?.isUserBanned) {
        const timeout = setTimeout(() => {
          router.push('/api/auth/logout');
        }, 5000);
  
        return () => clearTimeout(timeout); // Cleanup timeout on unmount
      }
    };
  
    fetchUser();
  }, [router]); // Make sure to rerun this effect if the router changes
  

  return (
    <>
    {user && user.isUserBanned && (

  <AlertDialog open={true} >
  <AlertDialogContent>
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
