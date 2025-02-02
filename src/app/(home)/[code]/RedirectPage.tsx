/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useEffect } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from '@/components/ui/alert-dialog';
import { usePathname, useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';
import { AffiliateLink, User } from '@prisma/client';
import { createAffiliateClick } from './actions';
import { useDispatch } from 'react-redux';
import { saveRedirectUrl } from '@/store/actions/action';
import LoadingLink from '@/components/LoadingLink';
import { buttonVariants } from '@/components/ui/button';


interface PageProps {
  affiliateLink: AffiliateLink;
  user : User | null | undefined;
}

const RedirectPage = ({  affiliateLink , user }: PageProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  useEffect(() => {

    const handleAffiliateClick = async () => {
      try {
        if(!user) { 
          dispatch(saveRedirectUrl(pathname));
        } else {
          if (user.affiliateOrderSessionId) {
            await createAffiliateClick(affiliateLink ,user , true);
            router.push(affiliateLink.originalLink); // Redirect immediately
          } else {
            await createAffiliateClick(affiliateLink ,user , false);
            router.push(affiliateLink.originalLink); // Redirect immediately
          }
        }
      } catch (error) {
        console.error('Error during affiliate click handling:', error);
      }
    };

    handleAffiliateClick();
  }, [affiliateLink, router, dispatch, user, pathname]);


  return (
    <>
    <div className='mb-96'>

    </div>
      {/* Your AlertDialog and countdown UI */}
      {user ? (
      <AlertDialog open={true}>
        <AlertDialogContent>
          <AlertDialogHeader className="flex flex-col items-center">
            <div className="text-blue-700 mb-2">
              <Loader className="animate-spin" />
            </div>
            <AlertDialogTitle className="text-xl font-bold text-center">
              Redirecting...
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Please wait while we redirect you to your destination...
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
      ) : (
        <AlertDialog open={true}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl text-center font-bold tracking-tight">
              Log in to continue
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-center py-2">
              Please login and{" "}
              <span className="font-medium text-blue-500">
                you'll be redirected to this page!
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex items-end justify-end">
            <LoadingLink
              className={buttonVariants({
                variant: "default",
                size : "sm",
                className: "text-white w-20",
              })}
              href="/auth/sign-in"
            >
              Login
            </LoadingLink>
          </div>
        </AlertDialogContent>
      </AlertDialog>
      )}

    </>
  );
};

export default RedirectPage;